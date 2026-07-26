import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/joins-semantic-authority.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/joins-semantic-authority.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/joins-semantic-authority.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-joins-semantic-authority-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/joins-semantic-authority.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/joins-semantic-authority.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/joins-semantic-authority.result.schema.v1.json" with { type: "json" };
import { executesJoinsSemanticAuthority, observesJoinsSemanticAuthorityFacts } from "../../../4-adapters/typescript/observes-joins-semantic-authority-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersJoinsSemanticAuthorityAuthority = Object.freeze({
  capabilityId: "joins-semantic-authority",
  authorityRoot: "capabilities/joins-semantic-authority",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-unjoinable-sources"]);

export function createsJoinsSemanticAuthorityRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "joins-semantic-authority",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesJoinsSemanticAuthorityFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesJoinsSemanticAuthority(payload, resolved) as JsonObject,
  });
}

export function createsJoinsSemanticAuthorityEdges(): SemanticEdges {
  return createsJoinsSemanticAuthorityRuntime().edges;
}
