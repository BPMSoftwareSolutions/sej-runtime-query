import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { SemanticKernelError } from "@deterministic-solutions/semantic-kernel";
import {
  createsCapabilityRuntimeById,
  invokesCapability,
  listsImplementedCapabilities,
  readsCapabilityBody,
} from "../../dist/composition-root/creates-capability-registry.js";

const capabilityIds = listsImplementedCapabilities();
const reads = (capabilityId, relative) =>
  JSON.parse(fs.readFileSync(path.join("capabilities", capabilityId, relative), "utf8"));

test("every drafted capability has been promoted to a live implementation", () => {
  const contract = JSON.parse(fs.readFileSync(path.join("architecture", "query-engine.body.contract.v1.json"), "utf8"));
  const implemented = contract.capabilities.filter((entry) => entry.status === "implemented").map((entry) => entry.capabilityId);
  const drafted = contract.capabilities.filter((entry) => entry.status === "drafted");

  assert.equal(drafted.length, 0, `capabilities still drafted: ${drafted.map((entry) => entry.capabilityId).join(", ")}`);
  assert.equal(implemented.length, 26);
  // 25 seat their own authority; applies-semantic-projection resolves external authority.
  assert.equal(capabilityIds.length, 25);
});

for (const capabilityId of capabilityIds) {
  test(`${capabilityId} executes its declared success vector through the kernel`, async () => {
    const request = reads(capabilityId, `proof/fixtures/${capabilityId}.accepts.input.json`);
    const expected = reads(capabilityId, `proof/expectations/${capabilityId}.accepts.expected.json`);
    const vector = reads(capabilityId, `conformance/${capabilityId}.conformance.v1.json`);
    const receipt = await invokesCapability(capabilityId, request);

    assert.deepEqual(receipt, expected, "receipt drifted from its recorded expectation");
    assert.equal(receipt.disposition, vector.expectedDisposition);
    assert.equal(receipt.capabilityId, capabilityId);
    assert.deepEqual(receipt.findings, []);
    assert.ok(receipt.result !== undefined, "a successful capability must project a result");
    assert.match(receipt.authorityHash, /^sha256:[a-f0-9]{64}$/);
    assert.match(receipt.inputHash, /^sha256:[a-f0-9]{64}$/);
    assert.match(receipt.resultHash, /^sha256:[a-f0-9]{64}$/);
  });

  test(`${capabilityId} fails closed on its declared rejection vector`, async () => {
    const request = reads(capabilityId, `proof/fixtures/${capabilityId}.rejects.input.json`);
    const expected = reads(capabilityId, `proof/expectations/${capabilityId}.rejects.expected.json`);
    const vector = reads(capabilityId, `conformance/${capabilityId}.rejects.conformance.v1.json`);
    const receipt = await invokesCapability(capabilityId, request);

    assert.deepEqual(receipt, expected, "rejection receipt drifted from its recorded expectation");
    assert.equal(receipt.disposition, vector.expectedDisposition);
    assert.ok(receipt.findings.length > 0, "a rejection must record at least one finding");
    assert.equal(receipt.result, undefined, "a rejected capability must not project a result");
    assert.ok(receipt.findings.every((finding) => typeof finding.findingId === "string" && finding.findingId.length > 0));
  });

  test(`${capabilityId} records the declared decision and rule that governed it`, async () => {
    const request = reads(capabilityId, `proof/fixtures/${capabilityId}.accepts.input.json`);
    const decision = reads(capabilityId, `1-semantic-authority/decisions/${capabilityId}.decision.sej.v1.json`);
    const receipt = await invokesCapability(capabilityId, request);

    assert.equal(receipt.decisionId, decision.decisionId);
    assert.ok(
      decision.rules.some((rule) => rule.ruleId === receipt.resolvedRule),
      `resolved rule ${receipt.resolvedRule} is not declared in ${decision.decisionId}`,
    );
  });

  test(`${capabilityId} is deterministic and does not mutate its request`, async () => {
    const request = reads(capabilityId, `proof/fixtures/${capabilityId}.accepts.input.json`);
    const before = structuredClone(request);
    const [first, second, ...concurrent] = await Promise.all(
      Array.from({ length: 6 }, () => invokesCapability(capabilityId, request)),
    );

    assert.deepEqual(request, before, "capability mutated its request");
    assert.deepEqual(first, second, "capability is not deterministic");
    assert.ok(concurrent.every((receipt) => receipt.resultHash === first.resultHash));
    assert.ok(concurrent.every((receipt) => receipt.authorityHash === first.authorityHash));
  });

  test(`${capabilityId} rejects a request that violates its input contract`, async () => {
    await assert.rejects(
      () => invokesCapability(capabilityId, { requestType: "wrong-request.v1", requestId: "", payload: { unexpected: true } }),
      (error) => error instanceof SemanticKernelError && error.code === "INPUT_CONTRACT_INVALID",
    );
  });
}

test("capability bodies delegate only through declared semantic edges", async () => {
  for (const capabilityId of capabilityIds) {
    const body = readsCapabilityBody(capabilityId);
    const runtime = createsCapabilityRuntimeById(capabilityId);
    const observed = [];
    const recordingEdges = Object.freeze({
      invokes: async (identity, context) => {
        observed.push(`invokes:${identity}`);
        return runtime.edges.invokes(identity, context);
      },
      projects: (identity, context) => {
        observed.push(`projects:${identity}`);
        return runtime.edges.projects(identity, context);
      },
    });

    const request = reads(capabilityId, `proof/fixtures/${capabilityId}.accepts.input.json`);
    await body({ edges: recordingEdges, request });

    assert.deepEqual(observed, [
      `invokes:resolves-${capabilityId}-authority`,
      `invokes:executes-resolved-${capabilityId}`,
      `projects:projects-${capabilityId}-receipt`,
      `invokes:validates-${capabilityId}-receipt`,
    ], `${capabilityId} body did not delegate through its declared edges in order`);
  }
});

test("an undeclared semantic edge is rejected rather than silently ignored", async () => {
  const runtime = createsCapabilityRuntimeById("filters-query-rows");
  await assert.rejects(
    () => runtime.edges.invokes("invents-an-undeclared-edge", {}),
    (error) => error instanceof SemanticKernelError && error.code === "SEMANTIC_IDENTITY_UNDECLARED",
  );
});

test("every accepted conformance vector points at recorded proof evidence", () => {
  for (const capabilityId of capabilityIds) {
    for (const suffix of ["conformance.v1.json", "rejects.conformance.v1.json"]) {
      const vectorPath = path.join("capabilities", capabilityId, "conformance", `${capabilityId}.${suffix}`);
      const vector = JSON.parse(fs.readFileSync(vectorPath, "utf8"));
      assert.equal(vector.status, "accepted");
      assert.equal(vector.kernelExecution, "passed");

      const vectorRoot = path.dirname(vectorPath);
      for (const reference of [vector.inputFixture, vector.expectedFixture]) {
        assert.ok(fs.existsSync(path.resolve(vectorRoot, reference)), `${vectorPath} references missing ${reference}`);
      }
    }
  }
});
