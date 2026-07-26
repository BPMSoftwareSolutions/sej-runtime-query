import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/projects-language-delegation-shell.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/projects-language-delegation-shell.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/projects-language-delegation-shell.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-projects-language-delegation-shell-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/projects-language-delegation-shell.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/projects-language-delegation-shell.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/projects-language-delegation-shell.result.schema.v1.json" with { type: "json" };
import { executesProjectsLanguageDelegationShell, observesProjectsLanguageDelegationShellFacts } from "../../../4-adapters/typescript/observes-projects-language-delegation-shell-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersProjectsLanguageDelegationShellAuthority = Object.freeze({
  capabilityId: "projects-language-delegation-shell",
  authorityRoot: "capabilities/projects-language-delegation-shell",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-unsupported-target"]);

export function createsProjectsLanguageDelegationShellRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "projects-language-delegation-shell",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesProjectsLanguageDelegationShellFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesProjectsLanguageDelegationShell(payload, resolved) as JsonObject,
  });
}

export function createsProjectsLanguageDelegationShellEdges(): SemanticEdges {
  return createsProjectsLanguageDelegationShellRuntime().edges;
}
