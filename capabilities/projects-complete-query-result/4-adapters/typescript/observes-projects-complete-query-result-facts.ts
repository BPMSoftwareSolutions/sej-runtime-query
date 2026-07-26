import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresArray,
  projectsCompleteResultThroughKernel,
} from "../../../../composition-root/shared/computes-capability-observations.js";
import {
  requiresJsonObject,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesProjectsCompleteQueryResultFacts(payload: JsonObject): JsonObject {
  const rows = requiresArray(payload.rows, "Rows are required.");
  return Object.freeze({ rowCount: rows.length });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesProjectsCompleteQueryResult(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const projectedValue = projectsCompleteResultThroughKernel(
    requiresArray(payload.rows, "Rows are required."),
    requiresJsonObject(payload.resultProjection, "Result projection must be a JSON object."),
  );
  return Object.freeze({ projectedValue, payload, decision });
}
