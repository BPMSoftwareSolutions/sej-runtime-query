import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const queryRoot = process.cwd();
const kernelRoot = path.resolve(queryRoot, "..", "semantic-kernel");
const layoutShaperRoot = path.resolve(queryRoot, "..", "layout-shaper");
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "sej-runtime-query-consumer-"));

try {
  runs("npm", ["run", "build"], kernelRoot);
  runs("npm", ["run", "build"], layoutShaperRoot);
  const kernelArchive = packs(kernelRoot, temporaryRoot);
  const layoutShaperArchive = packs(layoutShaperRoot, temporaryRoot);
  const queryArchive = packs(queryRoot, temporaryRoot);

  fs.writeFileSync(path.join(temporaryRoot, "package.json"), JSON.stringify({
    name: "sej-runtime-query-packed-consumer-proof",
    private: true,
    type: "module",
  }, null, 2));
  runs("npm", ["install", "--ignore-scripts", kernelArchive, layoutShaperArchive, queryArchive], temporaryRoot);

  fs.copyFileSync(
    path.join(queryRoot, "examples", "workspaces", "projection-demo", ".sej-query", "projections", "project-capability-summary.sej.v1.json"),
    path.join(temporaryRoot, "project-capability-summary.sej.v1.json"),
  );
  fs.writeFileSync(path.join(temporaryRoot, "consumer.mjs"), consumerProgram());
  runs(process.execPath, ["consumer.mjs"], temporaryRoot);
  console.log("PASS packed-consumer (kernel + layout-shaper + query tarballs + public API execution)");
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

function packs(packageRoot, destination) {
  const result = spawnSync("npm", ["pack", "--json", "--pack-destination", destination], {
    cwd: packageRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) throwsCommandFailure("npm pack", result);
  const report = JSON.parse(result.stdout);
  const filename = report[0]?.filename;
  if (typeof filename !== "string") throw new Error(`npm pack did not report a filename for ${packageRoot}`);
  return path.join(destination, filename);
}

function runs(command, argumentsList, cwd) {
  const result = spawnSync(command, argumentsList, {
    cwd,
    encoding: "utf8",
    shell: command === "npm" && process.platform === "win32",
  });
  if (result.status !== 0) throwsCommandFailure(`${command} ${argumentsList.join(" ")}`, result);
}

function throwsCommandFailure(command, result) {
  throw new Error(`${command} failed\n${result.stdout ?? ""}\n${result.stderr ?? ""}`);
}

function consumerProgram() {
  return `
import assert from "node:assert/strict";
import {
  createsSemanticProjectionCapability,
  startsQueryEngine,
} from "@deterministic-solutions/sej-runtime-query";

const capability = createsSemanticProjectionCapability({ workspaceRoot: process.cwd() });
const receipt = await capability.apply({
  requestType: "apply-semantic-projection-request.v1",
  requestId: "packed-consumer",
  queryResult: {
    queryResultType: "sej-query-result.v1",
    query: { normalizedText: "SELECT *", queryHash: "sha256:packed-query" },
    source: { sourceId: "packed-source", sourceHash: "sha256:packed-source" },
    selection: { columns: [{ name: "relativePath", sourcePath: "$.relativePath" }] },
    rows: [{
      relativePath: "capabilities/example.json",
      sejClassification: "sej",
      semanticExecutableJsonVersion: "1.0.0"
    }],
    rowCount: 1,
    execution: { whereApplied: false, limitApplied: null }
  },
  selector: {
    projectionId: "project-capability-summary",
    explicitAuthorityPath: "project-capability-summary.sej.v1.json"
  },
  projectionContext: {}
});

assert.equal(receipt.disposition, "QUERY_RESULT_PROJECTED");
assert.equal(receipt.projectedResult.value[0].classification, "SEJ");

const { engine } = startsQueryEngine({ capabilityPacks: [], portAdapters: {} });
const presented = await engine.invoke({
  requestType: "executes-relational-query-request.v1",
  requestId: "packed-presentation",
  payload: {
    commandText:
      "SELECT relativePath, sejClassification FROM registry APPLY RESULT PROJECTION project-workspace-capability-report",
    sources: {
      registry: [{
        relativePath: "capabilities/example.json",
        sejClassification: "sej"
      }]
    }
  }
});

assert.equal(presented.disposition, "QUERY_RESULT_PRESENTED");
assert.equal(presented.presentationReceipt.layoutShapeId,
  "workspace-capability-report.v1::workspace-capability-report-terminal");
assert.match(presented.rendered, /Capabilities: 1/);
`;
}
