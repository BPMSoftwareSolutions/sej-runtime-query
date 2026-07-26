import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresArray,
  explainsRecordedTestimony,
} from "../../../../composition-root/shared/computes-capability-observations.js";
import {
  requiresJsonObject,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesExplainsSemanticExecutionFacts(payload: JsonObject): JsonObject {
  const receipt = requiresJsonObject(payload.receipt, "Receipt must be a JSON object.");
  const steps = requiresArray(receipt.steps, "Receipt steps are required.");
  return Object.freeze({ stepCount: steps.length });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesExplainsSemanticExecution(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const explanation = explainsRecordedTestimony(payload, String(decision));
  return Object.freeze({ explanation, payload, decision });
}
