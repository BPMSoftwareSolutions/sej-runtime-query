import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresString,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesParsesQueryCommandFacts(payload: JsonObject): JsonObject {
  return Object.freeze({ textLength: requiresString(payload.normalizedText, "Normalized text is required.").length });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesParsesQueryCommand(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  return Object.freeze({ payload, decision });
}
