import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  findsMissingAssertions,
  projectsProofFromTestimony,
} from "../../../../composition-root/shared/computes-capability-observations.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesProjectsSemanticProofFacts(payload: JsonObject): JsonObject {
  const missingAssertions = findsMissingAssertions(payload);
  return Object.freeze({ missingAssertionCount: missingAssertions.length, missingAssertions });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesProjectsSemanticProof(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const proof = projectsProofFromTestimony(payload);
  const missingAssertions = findsMissingAssertions(payload);
  return Object.freeze({ proof, missingAssertions, payload, decision });
}
