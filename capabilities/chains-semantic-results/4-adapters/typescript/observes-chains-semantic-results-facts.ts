import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresJsonObject,
  requiresJsonValue,
  requiresString,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesChainsSemanticResultsFacts(payload: JsonObject): JsonObject {
  return Object.freeze({
    contractsEqual: payload.producedContractId === payload.acceptedContractId,
  });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesChainsSemanticResults(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const chainedInput = requiresJsonObject({
    requestType: `${requiresString(payload.acceptedContractId, "Accepted contract is required.")}-chained-input`,
    payload: requiresJsonValue(payload.producedValue, "Produced value must be JSON."),
  }, "Chained input must be JSON.");
  return Object.freeze({ chainedInput, payload, decision });
}
