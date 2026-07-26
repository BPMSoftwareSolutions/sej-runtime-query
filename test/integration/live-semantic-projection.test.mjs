import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createSemanticKernel, SemanticKernelError } from "@deterministic-solutions/semantic-kernel";
import { appliesSemanticProjection } from "../../dist/capabilities/applies-semantic-projection/runtime/typescript/bodies/applies-semantic-projection.js";
import { registersSemanticProjectionAuthority } from "../../dist/capabilities/applies-semantic-projection/runtime/typescript/registration/registers-semantic-projection-authority.js";
import { createsSemanticProjectionCapability, startsQueryEngine } from "../../dist/composition-root/exports-query-library.js";

const capabilityRoot = path.join("capabilities", "applies-semantic-projection");
const demoRoot = path.join("examples", "workspaces", "projection-demo", ".sej-query");
const read = (relative) => JSON.parse(fs.readFileSync(path.join(capabilityRoot, relative), "utf8"));

function createsRuntime(options = {}) {
  const kernel = createSemanticKernel();
  const edges = registersSemanticProjectionAuthority(kernel, {
    workspaceRoot: process.cwd(),
    ...options,
  });
  return { kernel, edges };
}

test("executes the row-scoped proof vector through the adjacent semantic kernel", async () => {
  const { edges } = createsRuntime();
  const request = read("proof/fixtures/applies-row-projection.input.json");
  const expected = read("proof/expectations/applies-row-projection.expected.json");
  const receipt = await appliesSemanticProjection({ edges, request });

  assert.equal(receipt.disposition, "QUERY_RESULT_PROJECTED");
  assert.deepEqual(receipt.projectedResult, expected);
  assert.equal(receipt.inputRowCount, 1);
  assert.equal(receipt.projectedRowCount, 1);
  assert.equal(receipt.rejectedRowCount, 0);
  assert.match(receipt.authorityHash, /^sha256:[a-f0-9]{64}$/);
  assert.match(receipt.projectionAuthorityHash, /^sha256:[a-f0-9]{64}$/);
  assert.match(receipt.inputHash, /^sha256:[a-f0-9]{64}$/);
  assert.match(receipt.resultHash, /^sha256:[a-f0-9]{64}$/);
});

test("exposes the implemented projection slice through the public library surface", async () => {
  const capability = createsSemanticProjectionCapability({ workspaceRoot: process.cwd() });
  const request = read("proof/fixtures/applies-row-projection.input.json");
  const receipt = await capability.apply(request);
  assert.equal(receipt.disposition, "QUERY_RESULT_PROJECTED");
  assert.equal(receipt.projectionId, "project-capability-summary");
});

test("is deterministic, immutable, and safe for concurrent projection requests", async () => {
  const capability = createsSemanticProjectionCapability({ workspaceRoot: process.cwd() });
  const request = read("proof/fixtures/applies-row-projection.input.json");
  const before = structuredClone(request);
  const [first, second, ...concurrent] = await Promise.all([
    capability.apply(request),
    capability.apply(request),
    ...Array.from({ length: 8 }, () => capability.apply(request)),
  ]);

  assert.deepEqual(request, before);
  assert.deepEqual(first, second);
  assert.ok(concurrent.every((receipt) => receipt.resultHash === first.resultHash));
  assert.ok(concurrent.every((receipt) => receipt.inputHash === first.inputHash));
  assert.ok(concurrent.every((receipt) => receipt.projectionAuthorityHash === first.projectionAuthorityHash));
});

test("executes filtering, counting, and mapping for the complete-result proof vector", async () => {
  const { edges } = createsRuntime();
  const request = read("proof/fixtures/applies-result-set-projection.input.json");
  const expected = read("proof/expectations/applies-result-set-projection.expected.json");
  const receipt = await appliesSemanticProjection({ edges, request });

  assert.equal(receipt.disposition, "QUERY_RESULT_PROJECTED");
  assert.deepEqual(receipt.projectedResult, expected);
  assert.equal(receipt.inputRowCount, 2);
  assert.equal(receipt.projectedRowCount, 1);
  assert.equal(receipt.rejectedRowCount, 0);
});

test("projects an empty complete result without inventing rows", async () => {
  const { edges } = createsRuntime();
  const request = read("proof/fixtures/applies-result-set-projection.input.json");
  request.queryResult.rows = [];
  request.queryResult.rowCount = 0;
  const receipt = await appliesSemanticProjection({ edges, request });

  assert.deepEqual(receipt.projectedResult.value, {
    reportType: "workspace-capability-report.v1",
    capabilityCount: 0,
    otherDocumentCount: 0,
    capabilities: [],
  });
  assert.equal(receipt.inputRowCount, 0);
  assert.equal(receipt.projectedRowCount, 1);
});

test("rejects a missing required row path through declared missing-value policy", async () => {
  const { edges } = createsRuntime();
  const request = read("proof/fixtures/rejects-missing-source-path.input.json");
  const expected = read("proof/expectations/rejects-missing-source-path.expected.json");
  const receipt = await appliesSemanticProjection({ edges, request });

  assert.equal(receipt.disposition, expected.disposition);
  assert.deepEqual(receipt.findings, expected.findings);
  assert.equal(receipt.projectedResult, null);
  assert.equal(receipt.inputRowCount, 1);
  assert.equal(receipt.projectedRowCount, 0);
  assert.equal(receipt.rejectedRowCount, 1);
});

test("resolves an accepted projection from the workspace registry", async () => {
  const registry = JSON.parse(fs.readFileSync(path.join(demoRoot, "projection-registry.v1.json"), "utf8"));
  const request = read("proof/fixtures/applies-row-projection.input.json");
  delete request.selector.explicitAuthorityPath;
  const { edges } = createsRuntime({ workspaceRoot: path.resolve(demoRoot), workspaceProjectionRegistry: registry });
  const receipt = await appliesSemanticProjection({ edges, request });

  assert.equal(receipt.projectionId, "project-capability-summary");
  assert.equal(receipt.disposition, "QUERY_RESULT_PROJECTED");
});

test("fails closed for invalid inputs, authority mismatch, and workspace escape", async () => {
  const invalidInput = read("proof/fixtures/applies-row-projection.input.json");
  delete invalidInput.queryResult;
  await assert.rejects(
    () => appliesSemanticProjection({ edges: createsRuntime().edges, request: invalidInput }),
    (error) => error instanceof SemanticKernelError && error.code === "INPUT_CONTRACT_INVALID",
  );

  const mismatched = read("proof/fixtures/applies-row-projection.input.json");
  mismatched.selector.projectionId = "different-projection";
  await assert.rejects(
    () => appliesSemanticProjection({ edges: createsRuntime().edges, request: mismatched }),
    (error) => error instanceof SemanticKernelError && error.code === "PROJECTION_ID_MISMATCH",
  );

  const escaping = read("proof/fixtures/applies-row-projection.input.json");
  escaping.selector.explicitAuthorityPath = "../semantic-kernel/package.json";
  await assert.rejects(
    () => appliesSemanticProjection({ edges: createsRuntime().edges, request: escaping }),
    /escapes the workspace root/,
  );
});

test("an engine with no seated authority rejects rather than inventing behavior", async () => {
  const { engine } = startsQueryEngine({ capabilityPacks: [], portAdapters: {} });
  await assert.rejects(
    () => engine.invoke({ requestType: "query-command-text.v1", commandText: "SELECT *" }),
    (error) => error instanceof SemanticKernelError && error.code === "DECLARATION_NOT_FOUND",
  );
});
