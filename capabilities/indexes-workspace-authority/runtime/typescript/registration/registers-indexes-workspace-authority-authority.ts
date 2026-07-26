import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/indexes-workspace-authority.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/indexes-workspace-authority.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/indexes-workspace-authority.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-indexes-workspace-authority-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/indexes-workspace-authority.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/indexes-workspace-authority.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/indexes-workspace-authority.result.schema.v1.json" with { type: "json" };
import { executesIndexesWorkspaceAuthority, observesIndexesWorkspaceAuthorityFacts } from "../../../4-adapters/typescript/observes-indexes-workspace-authority-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersIndexesWorkspaceAuthorityAuthority = Object.freeze({
  capabilityId: "indexes-workspace-authority",
  authorityRoot: "capabilities/indexes-workspace-authority",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze([]);

export function createsIndexesWorkspaceAuthorityRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "indexes-workspace-authority",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesIndexesWorkspaceAuthorityFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesIndexesWorkspaceAuthority(payload, resolved) as JsonObject,
  });
}

export function createsIndexesWorkspaceAuthorityEdges(): SemanticEdges {
  return createsIndexesWorkspaceAuthorityRuntime().edges;
}
