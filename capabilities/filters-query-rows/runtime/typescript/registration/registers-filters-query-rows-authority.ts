import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/filters-query-rows.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/filters-query-rows.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/filters-query-rows.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-filters-query-rows-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/filters-query-rows.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/filters-query-rows.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/filters-query-rows.result.schema.v1.json" with { type: "json" };
import { executesFiltersQueryRows, observesFiltersQueryRowsFacts } from "../../../4-adapters/typescript/observes-filters-query-rows-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersFiltersQueryRowsAuthority = Object.freeze({
  capabilityId: "filters-query-rows",
  authorityRoot: "capabilities/filters-query-rows",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-undeclared-predicate-operator"]);

export function createsFiltersQueryRowsRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "filters-query-rows",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesFiltersQueryRowsFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesFiltersQueryRows(payload, resolved) as JsonObject,
  });
}

export function createsFiltersQueryRowsEdges(): SemanticEdges {
  return createsFiltersQueryRowsRuntime().edges;
}
