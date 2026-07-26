import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/projects-complete-query-result.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/projects-complete-query-result.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/projects-complete-query-result.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-projects-complete-query-result-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/projects-complete-query-result.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/projects-complete-query-result.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/projects-complete-query-result.result.schema.v1.json" with { type: "json" };
import { executesProjectsCompleteQueryResult, observesProjectsCompleteQueryResultFacts } from "../../../4-adapters/typescript/observes-projects-complete-query-result-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersProjectsCompleteQueryResultAuthority = Object.freeze({
  capabilityId: "projects-complete-query-result",
  authorityRoot: "capabilities/projects-complete-query-result",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-empty-required-result"]);

export function createsProjectsCompleteQueryResultRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "projects-complete-query-result",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesProjectsCompleteQueryResultFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesProjectsCompleteQueryResult(payload, resolved) as JsonObject,
  });
}

export function createsProjectsCompleteQueryResultEdges(): SemanticEdges {
  return createsProjectsCompleteQueryResultRuntime().edges;
}
