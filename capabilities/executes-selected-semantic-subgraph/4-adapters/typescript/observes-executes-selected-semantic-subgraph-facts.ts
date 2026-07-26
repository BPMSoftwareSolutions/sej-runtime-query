import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  executesSubgraphThroughKernel,
} from "../../../../composition-root/shared/computes-capability-observations.js";
import {
  requiresJsonObject,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesExecutesSelectedSemanticSubgraphFacts(payload: JsonObject): JsonObject {
  const model = requiresJsonObject(payload.executionModel, "Execution model must be a JSON object.");
  return Object.freeze({ modelRegistered: model.executionModelId === payload.executionModelId });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export async function executesExecutesSelectedSemanticSubgraph(
  payload: JsonObject,
  decision: JsonValue,
): Promise<JsonObject> {
  const kernelReceipt = await executesSubgraphThroughKernel(payload);
  return Object.freeze({ kernelReceipt, payload, decision });
}
