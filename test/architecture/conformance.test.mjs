import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("repository conformance gates pass", () => {
  const result = spawnSync(process.execPath, ["conformance/run-all.mjs"], { encoding: "utf8" });
  assert.equal(result.status, 0, `${result.stdout}
${result.stderr}`);
});
