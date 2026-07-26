import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresArray,
  readsColumns,
} from "../../../../composition-root/shared/computes-capability-observations.js";
import {
  requiresJsonObject,
  requiresRecord,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesSelectsQueryFactsFacts(payload: JsonObject): JsonObject {
  const rows = requiresArray(payload.rows, "Rows are required.");
  const columns = readsColumns(payload.columns);
  const declaredNames = new Set(columns.map((column) => column.name));
  const unknownColumns = columns
    .filter((column) => rows.length > 0 && !Object.keys(requiresRecord(rows[0], "Row must be an object.")).includes(column.name))
    .map((column) => column.name);
  return Object.freeze({
    rowCount: rows.length,
    declaredColumnCount: declaredNames.size,
    unknownColumns,
    unknownColumnCount: unknownColumns.length,
  });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesSelectsQueryFacts(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const rows = requiresArray(payload.rows, "Rows are required.");
  const columns = readsColumns(payload.columns);
  const selectAll = payload.selectAll === true;
  const selectedRows = rows.map((row) => {
    const record = requiresRecord(row, "Row must be an object.");
    const projected = selectAll
      ? record
      : Object.fromEntries(columns.map((column) => [column.name, record[column.name] ?? null]));
    return requiresJsonObject(projected, "Selected row must be JSON.");
  });
  return Object.freeze({ selectedRows, payload, decision });
}
