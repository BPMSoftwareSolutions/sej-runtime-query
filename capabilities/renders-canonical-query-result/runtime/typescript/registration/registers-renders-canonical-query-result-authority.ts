import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/renders-canonical-query-result.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/renders-canonical-query-result.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/renders-canonical-query-result.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-renders-canonical-query-result-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/renders-canonical-query-result.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/renders-canonical-query-result.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/renders-canonical-query-result.result.schema.v1.json" with { type: "json" };
import { executesRendersCanonicalQueryResult, observesRendersCanonicalQueryResultFacts } from "../../../4-adapters/typescript/observes-renders-canonical-query-result-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersRendersCanonicalQueryResultAuthority = Object.freeze({
  capabilityId: "renders-canonical-query-result",
  authorityRoot: "capabilities/renders-canonical-query-result",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze([]);

export function createsRendersCanonicalQueryResultRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "renders-canonical-query-result",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesRendersCanonicalQueryResultFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesRendersCanonicalQueryResult(payload, resolved) as JsonObject,
  });
}

export function createsRendersCanonicalQueryResultEdges(): SemanticEdges {
  return createsRendersCanonicalQueryResultRuntime().edges;
}
