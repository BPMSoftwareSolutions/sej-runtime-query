import type { JsonObject, JsonValue, SemanticEdges } from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/resolves-authority-by-metadata.capability.sej.v1.json" with { type: "json" };
import decision from "../../../1-semantic-authority/decisions/resolves-authority-by-metadata.decision.sej.v1.json" with { type: "json" };
import policy from "../../../1-semantic-authority/policies/resolves-authority-by-metadata.policy.sej.v1.json" with { type: "json" };
import resultProjection from "../../../2-semantic-projections/projects-resolves-authority-by-metadata-result.sej.v1.json" with { type: "json" };
import inputSchema from "../../../contracts/resolves-authority-by-metadata.input.schema.v1.json" with { type: "json" };
import receiptSchema from "../../../contracts/resolves-authority-by-metadata.receipt.schema.v1.json" with { type: "json" };
import resultSchema from "../../../contracts/resolves-authority-by-metadata.result.schema.v1.json" with { type: "json" };
import { executesResolvesAuthorityByMetadata, observesResolvesAuthorityByMetadataFacts } from "../../../4-adapters/typescript/observes-resolves-authority-by-metadata-facts.js";
import {
  createsCapabilityRuntime,
  type CapabilityRuntime,
} from "../../../../../composition-root/shared/creates-capability-runtime.js";

export const registersResolvesAuthorityByMetadataAuthority = Object.freeze({
  capabilityId: "resolves-authority-by-metadata",
  authorityRoot: "capabilities/resolves-authority-by-metadata",
});

/**
 * Rules whose resolved outcome is a declared rejection. Listed here as data so
 * the runtime never infers failure from a value's shape.
 */
const rejectionRules = Object.freeze(["reject-no-metadata-match"]);

export function createsResolvesAuthorityByMetadataRuntime(): CapabilityRuntime {
  return createsCapabilityRuntime({
    capabilityId: "resolves-authority-by-metadata",
    capabilityAuthority,
    decision,
    resultProjection,
    inputSchema,
    resultSchema,
    receiptSchema,
    successDisposition: policy.successDisposition,
    failureDisposition: policy.failureDisposition,
    rejectionRules,
    observes: observesResolvesAuthorityByMetadataFacts,
    executes: (payload: JsonObject, resolved: JsonValue) => executesResolvesAuthorityByMetadata(payload, resolved) as JsonObject,
  });
}

export function createsResolvesAuthorityByMetadataEdges(): SemanticEdges {
  return createsResolvesAuthorityByMetadataRuntime().edges;
}
