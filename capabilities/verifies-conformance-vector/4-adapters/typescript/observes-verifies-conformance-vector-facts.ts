import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  computesCanonicalJsonHash,
} from "../../../../composition-root/shared/computes-capability-observations.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesVerifiesConformanceVectorFacts(payload: JsonObject): JsonObject {
  return Object.freeze({
    executable: payload.observed !== undefined && payload.expected !== undefined,
    observedHash: computesCanonicalJsonHash(payload.observed),
    expectedHash: computesCanonicalJsonHash(payload.expected),
  });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesVerifiesConformanceVector(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  return Object.freeze({
    observedHash: computesCanonicalJsonHash(payload.observed),
    expectedHash: computesCanonicalJsonHash(payload.expected),
    payload,
    decision,
  });
}
