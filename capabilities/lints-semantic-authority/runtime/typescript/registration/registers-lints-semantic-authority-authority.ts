import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/lints-semantic-authority.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/lints-semantic-authority.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/lints-semantic-authority.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-lints-semantic-authority-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/lints-semantic-authority.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/lints-semantic-authority.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/lints-semantic-authority.result.schema.v1.json" with { type: "json" };
import { executesLintsSemanticAuthority, observesLintsSemanticAuthorityFacts } from "../../../4-adapters/typescript/observes-lints-semantic-authority-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersLintsSemanticAuthorityAuthority = Object.freeze({
  capabilityId: "lints-semantic-authority",
  authorityRoot: "capabilities/lints-semantic-authority",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["blocking-defect"]);

export function createsLintsSemanticAuthorityRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "lints-semantic-authority",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesLintsSemanticAuthorityFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesLintsSemanticAuthority(payload, resolved) as JsonObject,
  });
}

export function createsLintsSemanticAuthorityEdges(): SemanticEdges {
  return createsLintsSemanticAuthorityRuntime().edges;
}
