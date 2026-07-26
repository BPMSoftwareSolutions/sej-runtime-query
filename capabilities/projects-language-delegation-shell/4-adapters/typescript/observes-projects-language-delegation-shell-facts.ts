import type { JsonObject, JsonValue } from "@deterministic-solutions/semantic-kernel";
import {
  projectsDelegationShell,
} from "../../../../composition-root/shared/computes-capability-observations.js";
import {
  requiresString,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

/**
 * Reports declared facts about the payload. Reports only; never chooses a
 * disposition. The declared decision consumes these facts.
 */
export function observesProjectsLanguageDelegationShellFacts(payload: JsonObject): JsonObject {
  return Object.freeze({
    targetSupported: requiresString(payload.target, "Target is required.") === "typescript",
  });
}

/**
 * Computes the value the declared result projection reads, after the declared
 * decision has resolved.
 */
export function executesProjectsLanguageDelegationShell(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const shell = projectsDelegationShell(payload);
  return Object.freeze({ delegationSteps: shell.steps, shellLineCount: shell.lineCount, payload, decision });
}
