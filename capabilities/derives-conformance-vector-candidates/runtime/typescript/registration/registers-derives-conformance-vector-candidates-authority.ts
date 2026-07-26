import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/derives-conformance-vector-candidates.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/derives-conformance-vector-candidates.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/derives-conformance-vector-candidates.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-derives-conformance-vector-candidates-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/derives-conformance-vector-candidates.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/derives-conformance-vector-candidates.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/derives-conformance-vector-candidates.result.schema.v1.json" with { type: "json" };
import { executesDerivesConformanceVectorCandidates, observesDerivesConformanceVectorCandidatesFacts } from "../../../4-adapters/typescript/observes-derives-conformance-vector-candidates-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersDerivesConformanceVectorCandidatesAuthority = Object.freeze({
  capabilityId: "derives-conformance-vector-candidates",
  authorityRoot: "capabilities/derives-conformance-vector-candidates",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-underivable-declaration"]);

export function createsDerivesConformanceVectorCandidatesRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "derives-conformance-vector-candidates",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesDerivesConformanceVectorCandidatesFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesDerivesConformanceVectorCandidates(payload, resolved) as JsonObject,
  });
}

export function createsDerivesConformanceVectorCandidatesEdges(): SemanticEdges {
  return createsDerivesConformanceVectorCandidatesRuntime().edges;
}
