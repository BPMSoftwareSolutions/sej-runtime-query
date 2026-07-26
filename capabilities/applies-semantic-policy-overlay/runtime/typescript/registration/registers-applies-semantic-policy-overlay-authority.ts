import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/applies-semantic-policy-overlay.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/applies-semantic-policy-overlay.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/applies-semantic-policy-overlay.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-applies-semantic-policy-overlay-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/applies-semantic-policy-overlay.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/applies-semantic-policy-overlay.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/applies-semantic-policy-overlay.result.schema.v1.json" with { type: "json" };
import { executesAppliesSemanticPolicyOverlay, observesAppliesSemanticPolicyOverlayFacts } from "../../../4-adapters/typescript/observes-applies-semantic-policy-overlay-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersAppliesSemanticPolicyOverlayAuthority = Object.freeze({
  capabilityId: "applies-semantic-policy-overlay",
  authorityRoot: "capabilities/applies-semantic-policy-overlay",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-loosening-overlay"]);

export function createsAppliesSemanticPolicyOverlayRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "applies-semantic-policy-overlay",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesAppliesSemanticPolicyOverlayFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesAppliesSemanticPolicyOverlay(payload, resolved) as JsonObject,
  });
}

export function createsAppliesSemanticPolicyOverlayEdges(): SemanticEdges {
  return createsAppliesSemanticPolicyOverlayRuntime().edges;
}
