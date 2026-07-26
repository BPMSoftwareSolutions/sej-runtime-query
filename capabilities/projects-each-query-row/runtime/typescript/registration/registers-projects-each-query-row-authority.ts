import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/projects-each-query-row.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/projects-each-query-row.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/projects-each-query-row.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-projects-each-query-row-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/projects-each-query-row.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/projects-each-query-row.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/projects-each-query-row.result.schema.v1.json" with { type: "json" };
import { executesProjectsEachQueryRow, observesProjectsEachQueryRowFacts } from "../../../4-adapters/typescript/observes-projects-each-query-row-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersProjectsEachQueryRowAuthority = Object.freeze({
  capabilityId: "projects-each-query-row",
  authorityRoot: "capabilities/projects-each-query-row",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze([]);

export function createsProjectsEachQueryRowRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "projects-each-query-row",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesProjectsEachQueryRowFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesProjectsEachQueryRow(payload, resolved) as JsonObject,
  });
}

export function createsProjectsEachQueryRowEdges(): SemanticEdges {
  return createsProjectsEachQueryRowRuntime().edges;
}
