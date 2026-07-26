import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/resolves-kernel-compatibility.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/resolves-kernel-compatibility.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/resolves-kernel-compatibility.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-resolves-kernel-compatibility-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/resolves-kernel-compatibility.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/resolves-kernel-compatibility.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/resolves-kernel-compatibility.result.schema.v1.json" with { type: "json" };
import { executesResolvesKernelCompatibility, observesResolvesKernelCompatibilityFacts } from "../../../4-adapters/typescript/observes-resolves-kernel-compatibility-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersResolvesKernelCompatibilityAuthority = Object.freeze({
  capabilityId: "resolves-kernel-compatibility",
  authorityRoot: "capabilities/resolves-kernel-compatibility",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["kernel-incompatible-primitives", "kernel-incompatible-specification"]);

export function createsResolvesKernelCompatibilityRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "resolves-kernel-compatibility",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesResolvesKernelCompatibilityFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesResolvesKernelCompatibility(payload, resolved) as JsonObject,
  });
}

export function createsResolvesKernelCompatibilityEdges(): SemanticEdges {
  return createsResolvesKernelCompatibilityRuntime().edges;
}
