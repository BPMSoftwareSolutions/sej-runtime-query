import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresArray,
  selectsMatchingEntries,
} from "../../../../composition-root/shared/computes-capability-observations.js";
import {
  requiresJsonValue,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesResolvesQuerySelectedAuthorityFacts(payload: JsonObject): JsonObject {
  const entries = requiresArray(payload.entries, "Entries are required.");
  const matches = selectsMatchingEntries(entries, payload);
  return Object.freeze({ entryCount: entries.length, matchCount: matches.length });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesResolvesQuerySelectedAuthority(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const entries = requiresArray(payload.entries, "Entries are required.");
  const matches = selectsMatchingEntries(entries, payload);
  const selectedEntry = requiresJsonValue(matches[0] ?? null, "Selected entry must be JSON.");
  return Object.freeze({ selectedEntry, payload, decision });
}
