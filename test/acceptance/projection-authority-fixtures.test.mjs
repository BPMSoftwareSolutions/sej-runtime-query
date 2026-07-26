import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = "capabilities/applies-semantic-projection";
const read = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));

test("projection authority resolution is explicit and fail closed", () => {
  const authority = read("1-semantic-authority/decisions/resolves-projection-authority.sej.v1.json");
  assert.deepEqual(authority.resolutionOrder, ["explicit-authority-file", "workspace-projection-registry", "source-owned-projection-authority"]);
  assert.equal(authority.implicitFallback, "forbidden");
  assert.equal(authority.rules.at(-1).then, "reject-projection-authority-not-found");
});

test("accepted proof vectors cover row, complete-result, and missing-path rejection", () => {
  const files = fs.readdirSync(path.join(root, "conformance")).filter((file) => file.endsWith(".json"));
  const vectors = files.map((file) => read(`conformance/${file}`));
  assert.equal(vectors.length, 3);
  assert.deepEqual(new Set(vectors.map((vector) => vector.projectionScope)), new Set(["each-row", "complete-result"]));
  assert.ok(vectors.some((vector) => vector.expectedDisposition === "QUERY_PROJECTION_REJECTED"));
  assert.ok(vectors.every((vector) => vector.status === "accepted"));
  assert.ok(vectors.every((vector) => vector.kernelExecution === "passed"));
});

test("projection receipt schema requires identity, authority, counts, contracts, and hashes", () => {
  const schema = read("contracts/projection-receipt.schema.v1.json");
  const required = new Set(schema.required);
  for (const field of ["runId", "queryHash", "sourceHashes", "projectionId", "projectionAuthorityHash", "projectionScope", "inputRowCount", "projectedRowCount", "rejectedRowCount", "inputContractId", "outputContractId", "resultHash", "disposition"]) {
    assert.ok(required.has(field), field);
  }
});
