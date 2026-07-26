import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  joinsAuthorityRows,
} from "../../../../composition-root/shared/computes-capability-observations.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesJoinsSemanticAuthorityFacts(payload: JsonObject): JsonObject {
  return Object.freeze({ hasJoinKey: payload.joinKey !== undefined });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesJoinsSemanticAuthority(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const joinedRows = joinsAuthorityRows(payload, String(decision));
  return Object.freeze({ joinedRows, payload, decision });
}
