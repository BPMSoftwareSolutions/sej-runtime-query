import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  findsMissingBindings,
  constructsExecutionContext,
} from "../../../../composition-root/shared/computes-capability-observations.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesConstructsSemanticExecutionContextFacts(payload: JsonObject): JsonObject {
  const missingBindings = findsMissingBindings(payload);
  return Object.freeze({ missingBindingCount: missingBindings.length, missingBindings });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesConstructsSemanticExecutionContext(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const constructedContext = constructsExecutionContext(payload);
  const missingBindings = findsMissingBindings(payload);
  return Object.freeze({ constructedContext, missingBindings, payload, decision });
}
