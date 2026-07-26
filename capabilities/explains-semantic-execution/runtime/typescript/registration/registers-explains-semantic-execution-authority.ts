import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/explains-semantic-execution.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/explains-semantic-execution.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/explains-semantic-execution.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-explains-semantic-execution-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/explains-semantic-execution.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/explains-semantic-execution.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/explains-semantic-execution.result.schema.v1.json" with { type: "json" };
import { executesExplainsSemanticExecution, observesExplainsSemanticExecutionFacts } from "../../../4-adapters/typescript/observes-explains-semantic-execution-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersExplainsSemanticExecutionAuthority = Object.freeze({
  capabilityId: "explains-semantic-execution",
  authorityRoot: "capabilities/explains-semantic-execution",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-absent-testimony"]);

export function createsExplainsSemanticExecutionRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "explains-semantic-execution",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesExplainsSemanticExecutionFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesExplainsSemanticExecution(payload, resolved) as JsonObject,
  });
}

export function createsExplainsSemanticExecutionEdges(): SemanticEdges {
  return createsExplainsSemanticExecutionRuntime().edges;
}
