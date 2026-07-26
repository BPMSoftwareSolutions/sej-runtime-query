import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresArray,
  findsCompositionConflicts,
  composesDeclarations,
} from "../../../../composition-root/shared/computes-capability-observations.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesComposesSemanticAuthorityFacts(payload: JsonObject): JsonObject {
  const conflicts = findsCompositionConflicts(requiresArray(payload.declarations, "Declarations are required."));
  return Object.freeze({ conflictCount: conflicts.length, conflictKeys: conflicts });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesComposesSemanticAuthority(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const composed = composesDeclarations(
    requiresArray(payload.declarations, "Declarations are required."),
    String(decision),
  );
  const conflicts = findsCompositionConflicts(requiresArray(payload.declarations, "Declarations are required."));
  return Object.freeze({ composed, conflictCount: conflicts.length, payload, decision });
}
