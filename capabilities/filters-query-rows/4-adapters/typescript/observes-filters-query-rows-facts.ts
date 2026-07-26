import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresArray,
  evaluatesRowPredicate,
  isDeclaredPredicateOperator,
} from "../../../../composition-root/shared/computes-capability-observations.js";
import {
  requiresJsonObject,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesFiltersQueryRowsFacts(payload: JsonObject): JsonObject {
  const rows = requiresArray(payload.rows, "Rows are required.");
  return Object.freeze({
    rowCount: rows.length,
    hasPredicate: payload.predicate !== undefined,
    predicateOperatorDeclared: isDeclaredPredicateOperator(payload.predicate),
  });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesFiltersQueryRows(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const rows = requiresArray(payload.rows, "Rows are required.");
  const retainedRows = decision === "pass-through-unfiltered"
    ? rows
    : evaluatesRowPredicate(rows, requiresJsonObject(payload.predicate, "Predicate must be a JSON object."));
  return Object.freeze({ retainedRows, payload, decision });
}
