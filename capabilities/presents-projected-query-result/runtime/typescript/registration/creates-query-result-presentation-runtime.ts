import {
  createsLayoutShapeRegistry,
  projectsPromotedLayoutTemplate,
  registersPromotedLayoutTemplate,
  resolvesPromotedLayoutTemplate,
  type LayoutShapeRegistry,
  type SemanticLayoutTemplate,
} from "@deterministic-solutions/layout-shaper";
import {
  createSemanticKernel,
  SemanticKernelError,
  type DecisionDeclaration,
  type JsonObject,
  type JsonValue,
  type SemanticEdges,
} from "@deterministic-solutions/semantic-kernel";
import presentationDecision from "../../../1-semantic-authority/decisions/resolves-query-result-presentation.sej.v1.json" with { type: "json" };
import workspaceBinding from "../../../1-semantic-authority/bindings/bind-workspace-capability-report.sej.v1.json" with { type: "json" };
import workspaceTemplate from "../../../1-semantic-authority/layouts/workspace-capability-report.layout-template.sej.v1.json" with { type: "json" };
import capabilityAuthority from "../../../1-semantic-authority/presents-projected-query-result.capability.sej.v1.json" with { type: "json" };
import presentationInputSchema from "../../../contracts/presents-projected-query-result.input.schema.v1.json" with { type: "json" };
import presentationReceiptSchema from "../../../contracts/query-result-presentation-receipt.schema.v1.json" with { type: "json" };
import presentationModelSchema from "../../../contracts/semantic-presentation-model.schema.v1.json" with { type: "json" };
import workspaceReportSchema from "../../../contracts/workspace-capability-report.schema.v1.json" with { type: "json" };
import {
  bindsProjectedResultToLayout,
  rendersCanonicalJson,
  rendersTerminalPresentation,
  type LayoutContentBinding,
} from "../../../4-adapters/typescript/binds-and-renders-query-result.js";
import { createsJsonSchemaValidator } from "../../../../applies-semantic-projection/4-adapters/typescript/validates-json-schema.js";
import { computesCanonicalJsonHash } from "../../../../applies-semantic-projection/4-adapters/typescript/computes-canonical-json-hash.js";

export type QueryResultPresentationCapability = Readonly<{
  edges: SemanticEdges;
  present(request: unknown): Promise<unknown>;
}>;

type PresentationMetadata = Readonly<{
  layoutShapeId: string;
  bindingId: string;
  defaultSurface: "terminal";
}>;

type ResolvedPresentationAuthority = Readonly<{
  request: JsonObject;
  disposition: string;
  resultContractId: string;
  projectedValue: JsonValue;
  metadata: PresentationMetadata | null;
  registry: LayoutShapeRegistry;
  binding: LayoutContentBinding | null;
}>;

export function createsQueryResultPresentationRuntime(): QueryResultPresentationCapability {
  const kernel = createSemanticKernel();
  kernel.catalog.registerDecision(presentationDecision as DecisionDeclaration);
  const validator = createsJsonSchemaValidator([presentationModelSchema]);
  const registry = createsDefaultRegistry();
  const edges: SemanticEdges = Object.freeze({
    invokes: async <TResult = unknown>(identity: string, context: unknown): Promise<TResult> => {
      if (identity === "resolves-query-result-presentation-authority") {
        return resolvesAuthority(kernel, await registry, context) as TResult;
      }
      if (identity === "executes-resolved-query-result-presentation") {
        return executesResolvedAuthority(context) as Promise<TResult>;
      }
      return kernel.edges.invokes<TResult>(identity, context);
    },
    projects: <TResult = unknown>(identity: string, context: unknown): TResult => {
      if (identity !== "projects-query-result-presentation-receipt") {
        return kernel.edges.projects<TResult>(identity, context);
      }
      const receipt = requiresJsonObject(context, "Presentation receipt must be an object.");
      const validation = validator.validate(presentationReceiptSchema, receipt);
      if (!validation.valid) {
        throw new SemanticKernelError("PRESENTATION_RECEIPT_INVALID", "Presentation receipt failed its contract.", {
          findings: validation.findings,
        });
      }
      return receipt as TResult;
    },
    projectsCode: (projectorIdentity: string, authority: unknown, codeOptions?: unknown) =>
      kernel.edges.projectsCode(projectorIdentity, authority, codeOptions),
  });
  return Object.freeze({
    edges,
    present: async (request: unknown) => {
      const inputValidation = validator.validate(presentationInputSchema, request);
      if (!inputValidation.valid) {
        throw new SemanticKernelError("INPUT_CONTRACT_INVALID", "Presentation request failed its input contract.", {
          findings: inputValidation.findings,
        });
      }
      const { presentsProjectedQueryResult } = await import("../bodies/presents-projected-query-result.js");
      return presentsProjectedQueryResult(Object.freeze({ edges, request }));
    },
  });
}

async function createsDefaultRegistry(): Promise<LayoutShapeRegistry> {
  const empty = await createsLayoutShapeRegistry({ registryId: "sej-query-layout-shapes" });
  return registersPromotedLayoutTemplate({
    registry: empty,
    acceptsContractId: "workspace-capability-report.v1",
    template: workspaceTemplate as SemanticLayoutTemplate,
    supportedTargets: ["ascii-layout"],
  });
}

function resolvesAuthority(
  kernel: ReturnType<typeof createSemanticKernel>,
  registry: LayoutShapeRegistry,
  context: unknown,
): ResolvedPresentationAuthority {
  const bodyContext = requiresRecord(context, "Presentation body context must be an object.");
  const request = requiresJsonObject(bodyContext.request, "Presentation request must be an object.");
  const projectionReceipt = requiresRecord(request.projectionReceipt, "Projection receipt is required.");
  if (projectionReceipt.disposition !== "QUERY_RESULT_PROJECTED") {
    throw new SemanticKernelError("SUCCESSFUL_PROJECTION_REQUIRED", "Only successful semantic projection receipts can be presented.");
  }
  const resultContractId = requiresString(projectionReceipt.outputContractId, "Projection output contract is required.");
  const projectedResult = requiresRecord(projectionReceipt.projectedResult, "Projected result is required.");
  const projectedValue = requiresJsonValue(projectedResult.value, "Projected value must be JSON.");
  const schema = resultContractId === workspaceReportSchema.$id ? workspaceReportSchema : null;
  if (schema !== null) {
    const resultValidation = createsJsonSchemaValidator().validate(schema, projectedValue);
    if (!resultValidation.valid) {
      throw new SemanticKernelError("PROJECTED_RESULT_CONTRACT_INVALID", "Projected value failed its concrete output contract.", {
        findings: resultValidation.findings,
      });
    }
  }
  const metadata = readsPresentationMetadata(schema?.["x-sej-presentation"]);
  const layoutMatches = metadata === null
    ? []
    : registry.entries.filter(
      (entry) =>
        entry.layoutShapeId === metadata.layoutShapeId
        && entry.acceptsContractId === resultContractId
        && entry.supportedTargets.includes("ascii-layout"),
    );
  const binding = metadata?.bindingId === workspaceBinding.bindingId
    && workspaceBinding.acceptsContractId === resultContractId
    ? workspaceBinding as LayoutContentBinding
    : null;
  const disposition = kernel.resolve("resolves-query-result-presentation", {
    layoutMatchCount: layoutMatches.length,
    bindingMatchCount: binding === null ? 0 : 1,
  });
  return Object.freeze({
    request,
    disposition: requiresString(disposition, "Presentation disposition is required."),
    resultContractId,
    projectedValue,
    metadata,
    registry,
    binding,
  });
}

async function executesResolvedAuthority(context: unknown): Promise<JsonObject> {
  const authority = context as ResolvedPresentationAuthority;
  const executions: Readonly<Record<string, (value: ResolvedPresentationAuthority) => Promise<JsonObject>>> = {
    "render-declared-terminal-layout": rendersDeclaredLayout,
    "return-canonical-json-without-layout": returnsCanonicalJson,
    "reject-ambiguous-presentation-authority": rejectsAmbiguousAuthority,
  };
  const execution = executions[authority.disposition];
  if (execution === undefined) {
    throw new SemanticKernelError("PRESENTATION_DISPOSITION_UNSUPPORTED", `Unsupported presentation disposition: ${authority.disposition}`);
  }
  return execution(authority);
}

async function rendersDeclaredLayout(authority: ResolvedPresentationAuthority): Promise<JsonObject> {
  if (authority.metadata === null || authority.binding === null) {
    throw new SemanticKernelError("PRESENTATION_AUTHORITY_INCOMPLETE", "Resolved layout presentation authority is incomplete.");
  }
  const resolved = await resolvesPromotedLayoutTemplate({
    registry: authority.registry,
    acceptsContractId: authority.resultContractId,
    targetId: "ascii-layout",
  });
  if (resolved.layoutShapeId !== authority.metadata.layoutShapeId) {
    throw new SemanticKernelError("LAYOUT_SCHEMA_METADATA_MISMATCH", "Schema presentation metadata does not match the promoted registry entry.");
  }
  await projectsPromotedLayoutTemplate({ template: resolved.template, targetId: "ascii-layout" });
  const presentationModel = bindsProjectedResultToLayout(
    authority.resultContractId,
    authority.projectedValue,
    authority.binding,
  );
  const rendered = rendersTerminalPresentation(presentationModel);
  return projectsPresentationReceipt(authority, {
    receiptType: "query-result-presentation-receipt.v1",
    disposition: "QUERY_RESULT_PRESENTED",
    resultContractId: authority.resultContractId,
    surface: "terminal",
    layoutShapeId: resolved.layoutShapeId,
    bindingId: authority.binding.bindingId,
    presentationModel,
    rendered,
    fallbackDisposition: "not-required",
  });
}

async function returnsCanonicalJson(authority: ResolvedPresentationAuthority): Promise<JsonObject> {
  return projectsPresentationReceipt(authority, {
    receiptType: "query-result-presentation-receipt.v1",
    disposition: "CANONICAL_JSON_RETURNED",
    resultContractId: authority.resultContractId,
    surface: "terminal",
    layoutShapeId: null,
    bindingId: null,
    presentationModel: null,
    rendered: rendersCanonicalJson(authority.projectedValue),
    fallbackDisposition: "no-applicable-promoted-layout",
  });
}

async function rejectsAmbiguousAuthority(_authority: ResolvedPresentationAuthority): Promise<JsonObject> {
  throw new SemanticKernelError("PRESENTATION_AUTHORITY_AMBIGUOUS", "Presentation authority did not resolve uniquely.");
}

function projectsPresentationReceipt(
  authority: ResolvedPresentationAuthority,
  result: Readonly<Record<string, unknown>>,
): JsonObject {
  const runId = requiresString(authority.request.requestId, "Presentation request identity is required.");
  return requiresJsonObject({
    ...result,
    runId,
    capabilityId: "presents-projected-query-result",
    authorityHash: computesCanonicalJsonHash(capabilityAuthority),
    inputHash: computesCanonicalJsonHash(authority.request),
    resultHash: computesCanonicalJsonHash(result),
    findings: [],
  }, "Presentation receipt must be JSON.");
}

function readsPresentationMetadata(value: unknown): PresentationMetadata | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.layoutShapeId !== "string"
    || typeof value.bindingId !== "string"
    || value.defaultSurface !== "terminal"
  ) return null;
  return value as PresentationMetadata;
}

function requiresJsonObject(value: unknown, message: string): JsonObject {
  const candidate = requiresJsonValue(value, message);
  if (!isRecord(candidate)) throw new SemanticKernelError("JSON_OBJECT_REQUIRED", message);
  return candidate as JsonObject;
}

function requiresJsonValue(value: unknown, message: string): JsonValue {
  if (!isJsonValue(value)) throw new SemanticKernelError("JSON_VALUE_REQUIRED", message);
  return value;
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isRecord(value) && Object.values(value).every(isJsonValue);
}

function requiresRecord(value: unknown, message: string): Readonly<Record<string, unknown>> {
  if (!isRecord(value)) throw new SemanticKernelError("OBJECT_REQUIRED", message);
  return value;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requiresString(value: unknown, message: string): string {
  if (typeof value !== "string" || value.length === 0) throw new SemanticKernelError("STRING_REQUIRED", message);
  return value;
}
