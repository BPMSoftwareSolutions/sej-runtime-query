import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  classifiesOverlay,
  appliesOverlay,
} from "../../../../composition-root/shared/computes-capability-observations.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesAppliesSemanticPolicyOverlayFacts(payload: JsonObject): JsonObject {
  const classified = classifiesOverlay(payload);
  return Object.freeze({ looseningCount: classified.loosening.length, tighteningCount: classified.tightening.length, looseningKeys: classified.loosening });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesAppliesSemanticPolicyOverlay(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const effectivePolicy = appliesOverlay(payload);
  const classified = classifiesOverlay(payload);
  return Object.freeze({ effectivePolicy, tighteningCount: classified.tightening.length, payload, decision });
}
