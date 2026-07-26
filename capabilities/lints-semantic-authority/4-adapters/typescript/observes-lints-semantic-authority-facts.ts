import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  lintsDeclaration,
} from "../../../../composition-root/shared/computes-capability-observations.js";
import {
  requiresJsonObject,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesLintsSemanticAuthorityFacts(payload: JsonObject): JsonObject {
  const defects = lintsDeclaration(requiresJsonObject(payload.declaration, "Declaration must be a JSON object."));
  return Object.freeze({
    blockingCount: defects.filter((defect) => defect.severity === "blocking").length,
    advisoryCount: defects.filter((defect) => defect.severity === "advisory").length,
  });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesLintsSemanticAuthority(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const defects = lintsDeclaration(requiresJsonObject(payload.declaration, "Declaration must be a JSON object."));
  return Object.freeze({ defects, payload, decision });
}
