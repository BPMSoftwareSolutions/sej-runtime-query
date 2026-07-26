import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  requiresArray,
  findsMissingPrimitives,
} from "../../../../composition-root/shared/computes-capability-observations.js";
import {
  requiresString,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesResolvesKernelCompatibilityFacts(payload: JsonObject): JsonObject {
  const missingPrimitives = findsMissingPrimitives(payload);
  const supported = requiresArray(payload.supportedSpecifications, "Supported specifications are required.");
  return Object.freeze({
    missingPrimitiveCount: missingPrimitives.length,
    missingPrimitives,
    specificationSupported: supported.includes(
      requiresString(payload.specificationVersion, "Specification version is required."),
    ),
  });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesResolvesKernelCompatibility(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const missingPrimitives = findsMissingPrimitives(payload);
  return Object.freeze({ missingPrimitives, payload, decision });
}
