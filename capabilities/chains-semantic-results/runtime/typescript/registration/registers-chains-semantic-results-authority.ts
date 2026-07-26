import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/chains-semantic-results.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/chains-semantic-results.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/chains-semantic-results.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-chains-semantic-results-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/chains-semantic-results.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/chains-semantic-results.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/chains-semantic-results.result.schema.v1.json" with { type: "json" };
import { executesChainsSemanticResults, observesChainsSemanticResultsFacts } from "../../../4-adapters/typescript/observes-chains-semantic-results-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersChainsSemanticResultsAuthority = Object.freeze({
  capabilityId: "chains-semantic-results",
  authorityRoot: "capabilities/chains-semantic-results",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-incompatible-chain"]);

export function createsChainsSemanticResultsRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "chains-semantic-results",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesChainsSemanticResultsFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesChainsSemanticResults(payload, resolved) as JsonObject,
  });
}

export function createsChainsSemanticResultsEdges(): SemanticEdges {
  return createsChainsSemanticResultsRuntime().edges;
}
