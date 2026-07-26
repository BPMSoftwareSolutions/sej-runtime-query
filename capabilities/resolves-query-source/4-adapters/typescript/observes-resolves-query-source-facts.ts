import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";


/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesResolvesQuerySourceFacts(payload: JsonObject): JsonObject {
  return Object.freeze({ hasExplicitSource: payload.explicitSourceId !== undefined });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesResolvesQuerySource(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  return Object.freeze({ payload, decision });
}
