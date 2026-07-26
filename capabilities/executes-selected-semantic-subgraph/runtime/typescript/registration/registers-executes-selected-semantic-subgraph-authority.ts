import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/executes-selected-semantic-subgraph.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/executes-selected-semantic-subgraph.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/executes-selected-semantic-subgraph.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-executes-selected-semantic-subgraph-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/executes-selected-semantic-subgraph.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/executes-selected-semantic-subgraph.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/executes-selected-semantic-subgraph.result.schema.v1.json" with { type: "json" };
import { executesExecutesSelectedSemanticSubgraph, observesExecutesSelectedSemanticSubgraphFacts } from "../../../4-adapters/typescript/observes-executes-selected-semantic-subgraph-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersExecutesSelectedSemanticSubgraphAuthority = Object.freeze({
  capabilityId: "executes-selected-semantic-subgraph",
  authorityRoot: "capabilities/executes-selected-semantic-subgraph",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-unregistered-model"]);

export function createsExecutesSelectedSemanticSubgraphRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "executes-selected-semantic-subgraph",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesExecutesSelectedSemanticSubgraphFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesExecutesSelectedSemanticSubgraph(payload, resolved),
  });
}

export function createsExecutesSelectedSemanticSubgraphEdges(): SemanticEdges {
  return createsExecutesSelectedSemanticSubgraphRuntime().edges;
}
