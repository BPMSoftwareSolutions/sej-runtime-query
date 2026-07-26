import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/resolves-query-source.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/resolves-query-source.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/resolves-query-source.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-resolves-query-source-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/resolves-query-source.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/resolves-query-source.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/resolves-query-source.result.schema.v1.json" with { type: "json" };
import { executesResolvesQuerySource, observesResolvesQuerySourceFacts } from "../../../4-adapters/typescript/observes-resolves-query-source-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersResolvesQuerySourceAuthority = Object.freeze({
  capabilityId: "resolves-query-source",
  authorityRoot: "capabilities/resolves-query-source",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze([]);

export function createsResolvesQuerySourceRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "resolves-query-source",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesResolvesQuerySourceFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesResolvesQuerySource(payload, resolved) as JsonObject,
  });
}

export function createsResolvesQuerySourceEdges(): SemanticEdges {
  return createsResolvesQuerySourceRuntime().edges;
}
