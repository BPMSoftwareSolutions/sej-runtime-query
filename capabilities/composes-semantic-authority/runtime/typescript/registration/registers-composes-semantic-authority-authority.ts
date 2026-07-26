import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/composes-semantic-authority.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/composes-semantic-authority.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/composes-semantic-authority.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-composes-semantic-authority-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/composes-semantic-authority.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/composes-semantic-authority.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/composes-semantic-authority.result.schema.v1.json" with { type: "json" };
import { executesComposesSemanticAuthority, observesComposesSemanticAuthorityFacts } from "../../../4-adapters/typescript/observes-composes-semantic-authority-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersComposesSemanticAuthorityAuthority = Object.freeze({
  capabilityId: "composes-semantic-authority",
  authorityRoot: "capabilities/composes-semantic-authority",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-conflicting-authority"]);

export function createsComposesSemanticAuthorityRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "composes-semantic-authority",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesComposesSemanticAuthorityFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesComposesSemanticAuthority(payload, resolved) as JsonObject,
  });
}

export function createsComposesSemanticAuthorityEdges(): SemanticEdges {
  return createsComposesSemanticAuthorityRuntime().edges;
}
