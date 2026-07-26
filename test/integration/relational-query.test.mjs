import assert from "node:assert/strict";
import test from "node:test";
import { invokesCapability } from "../../dist/composition-root/creates-capability-registry.js";

const query = (commandText, sources, requestId) => invokesCapability("executes-relational-query", {
  requestType: "executes-relational-query-request.v1",
  requestId,
  payload: { commandText, sources },
});

test("executes full outer and right joins with declared null extension", async () => {
  const sources = {
    lefts: [{ id: 1, value: "left-one" }, { id: 2, value: "left-two" }],
    rights: [{ id: 2, value: "right-two" }, { id: 3, value: "right-three" }],
  };
  const full = await query(
    "SELECT l.id AS leftId, r.id AS rightId FROM lefts l FULL JOIN rights r ON l.id = r.id ORDER BY leftId, rightId",
    sources,
    "full-join",
  );
  const right = await query(
    "SELECT r.id, l.value AS leftValue FROM lefts l RIGHT JOIN rights r ON l.id = r.id ORDER BY r.id",
    sources,
    "right-join",
  );

  assert.equal(full.disposition, "RELATIONAL_QUERY_EXECUTED");
  assert.deepEqual(full.result.value.rows, [
    { leftId: null, rightId: 3 },
    { leftId: 1, rightId: null },
    { leftId: 2, rightId: 2 },
  ]);
  assert.deepEqual(right.result.value.rows, [
    { id: 2, leftValue: "left-two" },
    { id: 3, leftValue: null },
  ]);
});

test("executes HAVING, DISTINCT, scalar functions, pagination, and cross joins", async () => {
  const grouped = await query(
    "SELECT team, COUNT(*) AS members FROM people GROUP BY team HAVING COUNT(*) > 1 ORDER BY members DESC",
    { people: [{ team: "red" }, { team: "red" }, { team: "blue" }] },
    "having",
  );
  const distinct = await query(
    "SELECT DISTINCT LOWER(city) AS city FROM places ORDER BY city LIMIT 2 OFFSET 0",
    { places: [{ city: "ROME" }, { city: "rome" }, { city: "OSLO" }, { city: "LIMA" }] },
    "distinct",
  );
  const crossed = await query(
    "SELECT COUNT(*) AS combinations FROM a CROSS JOIN b",
    { a: [{ id: 1 }, { id: 2 }], b: [{ id: "x" }, { id: "y" }, { id: "z" }] },
    "cross",
  );

  assert.deepEqual(grouped.result.value.rows, [{ team: "red", members: 2 }]);
  assert.deepEqual(distinct.result.value.rows, [{ city: "lima" }, { city: "oslo" }]);
  assert.deepEqual(crossed.result.value.rows, [{ combinations: 6 }]);
});

test("fails closed for unparseable text and unresolved source authority", async () => {
  const unparseable = await query("DELETE FROM rows", { rows: [] }, "unparseable");
  const missing = await query("SELECT * FROM absent", {}, "missing");

  assert.equal(unparseable.disposition, "RELATIONAL_QUERY_REJECTED");
  assert.equal(unparseable.resolvedRule, "reject-unparseable-relational-query");
  assert.equal(missing.disposition, "RELATIONAL_QUERY_REJECTED");
  assert.equal(missing.resolvedRule, "reject-unavailable-relational-source");
});
