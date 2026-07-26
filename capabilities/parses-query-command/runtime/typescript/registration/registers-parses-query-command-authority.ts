import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/parses-query-command.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/parses-query-command.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/parses-query-command.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-parses-query-command-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/parses-query-command.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/parses-query-command.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/parses-query-command.result.schema.v1.json" with { type: "json" };
import { executesParsesQueryCommand, observesParsesQueryCommandFacts } from "../../../4-adapters/typescript/observes-parses-query-command-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersParsesQueryCommandAuthority = Object.freeze({
  capabilityId: "parses-query-command",
  authorityRoot: "capabilities/parses-query-command",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze([]);

export function createsParsesQueryCommandRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "parses-query-command",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesParsesQueryCommandFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesParsesQueryCommand(payload, resolved) as JsonObject,
  });
}

export function createsParsesQueryCommandEdges(): SemanticEdges {
  return createsParsesQueryCommandRuntime().edges;
}
