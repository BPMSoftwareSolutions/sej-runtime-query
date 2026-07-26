import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresArray,
  indexesAuthorityDocuments,
} from "../../../../composition-root/shared/computes-capability-observations.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesIndexesWorkspaceAuthorityFacts(payload: JsonObject): JsonObject {
  const explicitPaths = payload.explicitPaths === undefined ? [] : requiresArray(payload.explicitPaths, "Explicit paths must be an array.");
  const declaredRoots = payload.declaredRoots === undefined ? [] : requiresArray(payload.declaredRoots, "Declared roots must be an array.");
  return Object.freeze({ explicitPathCount: explicitPaths.length, declaredRootCount: declaredRoots.length });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesIndexesWorkspaceAuthority(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const entries = indexesAuthorityDocuments(payload, String(decision));
  return Object.freeze({ entries, payload, decision });
}
