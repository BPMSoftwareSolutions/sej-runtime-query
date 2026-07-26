import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/constructs-semantic-execution-context.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/constructs-semantic-execution-context.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/constructs-semantic-execution-context.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-constructs-semantic-execution-context-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/constructs-semantic-execution-context.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/constructs-semantic-execution-context.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/constructs-semantic-execution-context.result.schema.v1.json" with { type: "json" };
import { executesConstructsSemanticExecutionContext, observesConstructsSemanticExecutionContextFacts } from "../../../4-adapters/typescript/observes-constructs-semantic-execution-context-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersConstructsSemanticExecutionContextAuthority = Object.freeze({
  capabilityId: "constructs-semantic-execution-context",
  authorityRoot: "capabilities/constructs-semantic-execution-context",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-incomplete-context"]);

export function createsConstructsSemanticExecutionContextRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "constructs-semantic-execution-context",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesConstructsSemanticExecutionContextFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesConstructsSemanticExecutionContext(payload, resolved) as JsonObject,
  });
}

export function createsConstructsSemanticExecutionContextEdges(): SemanticEdges {
  return createsConstructsSemanticExecutionContextRuntime().edges;
}
