import assert from "node:assert/strict";
import test from "node:test";
import { startsQueryEngine } from "../../dist/composition-root/exports-query-library.js";

test("reuses the default query engine across repeated starts", () => {
  const first = startsQueryEngine({ capabilityPacks: [], portAdapters: {} });
  const second = startsQueryEngine({ capabilityPacks: [], portAdapters: {} });

  assert.strictEqual(first, second);
  assert.strictEqual(first.engine, second.engine);
});
