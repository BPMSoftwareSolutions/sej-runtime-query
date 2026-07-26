import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

test("semantic kernel is consumed as an external peer dependency", () => {
  assert.equal(packageJson.peerDependencies["@deterministic-solutions/semantic-kernel"], ">=0.1.0 <2.0.0");
  assert.equal(packageJson.devDependencies["@deterministic-solutions/semantic-kernel"], "file:../semantic-kernel");
  assert.equal(fs.existsSync("types/semantic-kernel-module.d.ts"), false);
  assert.equal(fs.existsSync("../semantic-kernel/dist/index.d.ts"), true);
  assert.equal(fs.existsSync("../semantic-kernel/src/contracts/relational.contract.ts"), false);
  assert.equal(fs.existsSync("../semantic-kernel/src/kernel/relational-query-engine.ts"), false);
  assert.equal(fs.existsSync("capabilities/executes-relational-query/contracts/relational-query-plan.schema.v1.json"), true);
  assert.equal(fs.existsSync("capabilities/executes-relational-query/4-adapters/typescript/executes-relational-query-plan.ts"), true);
  assert.equal(fs.existsSync("packages/node"), false);
  assert.equal(fs.existsSync("packages/python"), false);
  assert.equal(fs.existsSync("packages/csharp"), false);
  assert.equal(fs.existsSync("semantic-kernel"), false);
});
