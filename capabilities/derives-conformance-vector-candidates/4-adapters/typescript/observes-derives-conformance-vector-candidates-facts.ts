import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  derivesCandidates,
} from "../../../../composition-root/shared/computes-capability-observations.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesDerivesConformanceVectorCandidatesFacts(payload: JsonObject): JsonObject {
  const candidates = derivesCandidates(payload);
  return Object.freeze({ candidateCount: candidates.length });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesDerivesConformanceVectorCandidates(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const candidates = derivesCandidates(payload);
  return Object.freeze({ candidates, payload, decision });
}
