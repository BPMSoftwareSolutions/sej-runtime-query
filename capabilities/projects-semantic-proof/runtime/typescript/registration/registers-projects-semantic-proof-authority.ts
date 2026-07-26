import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/projects-semantic-proof.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/projects-semantic-proof.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/projects-semantic-proof.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-projects-semantic-proof-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/projects-semantic-proof.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/projects-semantic-proof.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/projects-semantic-proof.result.schema.v1.json" with { type: "json" };
import { executesProjectsSemanticProof, observesProjectsSemanticProofFacts } from "../../../4-adapters/typescript/observes-projects-semantic-proof-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersProjectsSemanticProofAuthority = Object.freeze({
  capabilityId: "projects-semantic-proof",
  authorityRoot: "capabilities/projects-semantic-proof",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-incomplete-proof"]);

export function createsProjectsSemanticProofRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "projects-semantic-proof",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesProjectsSemanticProofFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesProjectsSemanticProof(payload, resolved) as JsonObject,
  });
}

export function createsProjectsSemanticProofEdges(): SemanticEdges {
  return createsProjectsSemanticProofRuntime().edges;
}
