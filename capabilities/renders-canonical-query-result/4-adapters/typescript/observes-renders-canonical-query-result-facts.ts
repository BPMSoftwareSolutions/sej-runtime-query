import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  rendersDeclaredForm,
} from "../../../../composition-root/shared/computes-capability-observations.js";
import {
  requiresJsonValue,
  requiresString,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesRendersCanonicalQueryResultFacts(payload: JsonObject): JsonObject {
  return Object.freeze({ renderForm: requiresString(payload.renderForm, "Render form is required.") });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesRendersCanonicalQueryResult(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const rendered = rendersDeclaredForm(String(decision), requiresJsonValue(payload.value, "Value must be JSON."));
  return Object.freeze({ rendered, renderedByteLength: rendered.length, payload, decision });
}
