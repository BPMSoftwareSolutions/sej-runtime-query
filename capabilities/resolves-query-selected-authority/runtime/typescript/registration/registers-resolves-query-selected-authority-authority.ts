import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/resolves-query-selected-authority.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/resolves-query-selected-authority.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/resolves-query-selected-authority.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-resolves-query-selected-authority-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/resolves-query-selected-authority.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/resolves-query-selected-authority.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/resolves-query-selected-authority.result.schema.v1.json" with { type: "json" };
import { executesResolvesQuerySelectedAuthority, observesResolvesQuerySelectedAuthorityFacts } from "../../../4-adapters/typescript/observes-resolves-query-selected-authority-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersResolvesQuerySelectedAuthorityAuthority = Object.freeze({
  capabilityId: "resolves-query-selected-authority",
  authorityRoot: "capabilities/resolves-query-selected-authority",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-ambiguous-selection"]);

export function createsResolvesQuerySelectedAuthorityRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "resolves-query-selected-authority",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesResolvesQuerySelectedAuthorityFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesResolvesQuerySelectedAuthority(payload, resolved) as JsonObject,
  });
}

export function createsResolvesQuerySelectedAuthorityEdges(): SemanticEdges {
  return createsResolvesQuerySelectedAuthorityRuntime().edges;
}
