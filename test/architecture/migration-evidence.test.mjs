import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("legacy resolver assets are isolated as migration evidence", () => {
  const readme = fs.readFileSync("migration/legacy-runtime-resolver/README.md", "utf8");
  assert.match(readme, /observed migration evidence/i);
  assert.match(readme, /explicit admission record/i);
  assert.equal(fs.existsSync("migration/legacy-runtime-resolver/admission-records/admission-record.schema.v1.json"), true);
});
