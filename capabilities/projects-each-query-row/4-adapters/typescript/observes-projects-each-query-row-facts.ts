import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresArray,
  projectsRowsThroughKernel,
} from "../../../../composition-root/shared/computes-capability-observations.js";
import {
  requiresJsonObject,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesProjectsEachQueryRowFacts(payload: JsonObject): JsonObject {
  const rows = requiresArray(payload.rows, "Rows are required.");
  return Object.freeze({ rowCount: rows.length });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesProjectsEachQueryRow(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const rows = requiresArray(payload.rows, "Rows are required.");
  const projectedRows = projectsRowsThroughKernel(
    rows,
    requiresJsonObject(payload.rowProjection, "Row projection must be a JSON object."),
    String(decision),
  );
  return Object.freeze({ projectedRows, payload, decision });
}
