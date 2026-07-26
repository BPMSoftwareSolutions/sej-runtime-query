import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/selects-query-facts.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/selects-query-facts.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/selects-query-facts.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-selects-query-facts-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/selects-query-facts.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/selects-query-facts.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/selects-query-facts.result.schema.v1.json" with { type: "json" };
import { executesSelectsQueryFacts, observesSelectsQueryFactsFacts } from "../../../4-adapters/typescript/observes-selects-query-facts-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersSelectsQueryFactsAuthority = Object.freeze({
  capabilityId: "selects-query-facts",
  authorityRoot: "capabilities/selects-query-facts",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze([]);

export function createsSelectsQueryFactsRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "selects-query-facts",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesSelectsQueryFactsFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesSelectsQueryFacts(payload, resolved) as JsonObject,
  });
}

export function createsSelectsQueryFactsEdges(): SemanticEdges {
  return createsSelectsQueryFactsRuntime().edges;
}
