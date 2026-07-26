import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/routes-semantic-command.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/routes-semantic-command.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/routes-semantic-command.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-routes-semantic-command-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/routes-semantic-command.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/routes-semantic-command.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/routes-semantic-command.result.schema.v1.json" with { type: "json" };
import { executesRoutesSemanticCommand, observesRoutesSemanticCommandFacts } from "../../../4-adapters/typescript/observes-routes-semantic-command-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersRoutesSemanticCommandAuthority = Object.freeze({
  capabilityId: "routes-semantic-command",
  authorityRoot: "capabilities/routes-semantic-command",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze([]);

export function createsRoutesSemanticCommandRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "routes-semantic-command",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesRoutesSemanticCommandFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesRoutesSemanticCommand(payload, resolved) as JsonObject,
  });
}

export function createsRoutesSemanticCommandEdges(): SemanticEdges {
  return createsRoutesSemanticCommandRuntime().edges;
}
