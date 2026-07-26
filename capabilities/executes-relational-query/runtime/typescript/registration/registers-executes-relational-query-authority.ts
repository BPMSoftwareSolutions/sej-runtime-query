import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/executes-relational-query.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/executes-relational-query.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/executes-relational-query.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-executes-relational-query-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/executes-relational-query.input.schema.v1.json" with { type: "json" };
import relationalQueryPlanSchema from "../../../contracts/relational-query-plan.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/executes-relational-query.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/executes-relational-query.result.schema.v1.json" with { type: "json" };
import {
  executesRelationalQueryMechanics,
  observesExecutesRelationalQueryFacts,
} from "../../../4-adapters/typescript/interprets-relational-query.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersExecutesRelationalQueryAuthority = Object.freeze({
  capabilityId: "executes-relational-query",
  authorityRoot: "capabilities/executes-relational-query",
});

const rejectionRules = Object.freeze([
  "reject-unparseable-relational-query",
  "reject-unavailable-relational-source",
]);

export function createsExecutesRelationalQueryRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "executes-relational-query",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    contractSchemas: [relationalQueryPlanSchema],
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesExecutesRelationalQueryFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesRelationalQueryMechanics(payload, resolved),
  });
}

export function createsExecutesRelationalQueryEdges(): SemanticEdges {
  return createsExecutesRelationalQueryRuntime().edges;
}
