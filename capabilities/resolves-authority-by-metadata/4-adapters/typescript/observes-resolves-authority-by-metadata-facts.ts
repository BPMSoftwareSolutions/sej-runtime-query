import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  matchesByMetadata,
} from "../../../../composition-root/shared/computes-capability-observations.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesResolvesAuthorityByMetadataFacts(payload: JsonObject): JsonObject {
  const matchedEntries = matchesByMetadata(payload);
  return Object.freeze({ matchedCount: matchedEntries.length });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesResolvesAuthorityByMetadata(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const matchedEntries = matchesByMetadata(payload);
  return Object.freeze({ matchedEntries, payload, decision });
}
