import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/verifies-conformance-vector.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/verifies-conformance-vector.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/verifies-conformance-vector.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-verifies-conformance-vector-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/verifies-conformance-vector.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/verifies-conformance-vector.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/verifies-conformance-vector.result.schema.v1.json" with { type: "json" };
import { executesVerifiesConformanceVector, observesVerifiesConformanceVectorFacts } from "../../../4-adapters/typescript/observes-verifies-conformance-vector-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersVerifiesConformanceVectorAuthority = Object.freeze({
  capabilityId: "verifies-conformance-vector",
  authorityRoot: "capabilities/verifies-conformance-vector",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["vector-not-executable", "vector-failed"]);

export function createsVerifiesConformanceVectorRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "verifies-conformance-vector",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesVerifiesConformanceVectorFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesVerifiesConformanceVector(payload, resolved) as JsonObject,
  });
}

export function createsVerifiesConformanceVectorEdges(): SemanticEdges {
  return createsVerifiesConformanceVectorRuntime().edges;
}
