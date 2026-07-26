import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresString,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesRoutesSemanticCommandFacts(payload: JsonObject): JsonObject {
  return Object.freeze({ commandFamily: requiresString(payload.commandFamily, "Command family is required.") });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesRoutesSemanticCommand(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  return Object.freeze({ payload, decision });
}
