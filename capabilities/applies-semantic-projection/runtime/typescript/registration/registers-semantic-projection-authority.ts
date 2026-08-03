import {
  createSemanticKernel,
  SemanticKernelError,
  type DecisionDeclaration,
  type JsonObject,
  type JsonValue,
  type ProjectionDeclaration,
  type SemanticEdges,
  type SemanticKernel,
} from "@deterministic-solutions/semantic-kernel";
import capabilityAuthority from "../../../1-semantic-authority/applies-semantic-projection.capability.sej.v1.json" with { type: "json" };
import missingValueDecision from "../../../1-semantic-authority/decisions/resolves-missing-value-disposition.sej.v1.json" with { type: "json" };
import projectionAuthorityDecision from "../../../1-semantic-authority/decisions/resolves-projection-authority.sej.v1.json" with { type: "json" };
import projectionScopeDecision from "../../../1-semantic-authority/decisions/resolves-projection-execution-scope.sej.v1.json" with { type: "json" };
import projectedResultProjection from "../../../2-semantic-projections/projects-projected-result.sej.v1.json" with { type: "json" };
import projectionReceiptProjection from "../../../2-semantic-projections/projects-projection-receipt.sej.v1.json" with { type: "json" };
import applyProjectionInputSchema from "../../../contracts/apply-projection.input.schema.v1.json" with { type: "json" };
import projectedResultSchema from "../../../contracts/projected-result.schema.v1.json" with { type: "json" };
import projectionReceiptSchema from "../../../contracts/projection-receipt.schema.v1.json" with { type: "json" };
import queryResultEnvelopeSchema from "../../../contracts/query-result-envelope.schema.v1.json" with { type: "json" };
import { computesCanonicalJsonHash } from "../../../4-adapters/typescript/computes-canonical-json-hash.js";
import { readsProjectionAuthorityFile } from "../../../4-adapters/typescript/reads-projection-authority-file.js";
import { createsJsonSchemaValidator } from "../../../4-adapters/typescript/validates-json-schema.js";

export type ProjectionRegistryEntry = Readonly<{
  projectionId: string;
  authorityPath: string;
  status: string;
}>;

export type ProjectionRegistry = Readonly<{
  projections: readonly ProjectionRegistryEntry[];
}>;

export type SemanticProjectionRuntimeOptions = Readonly<{
  workspaceRoot: string;
  workspaceProjectionRegistry?: ProjectionRegistry;
  sourceOwnedProjectionAuthorities?: Readonly<Record<string, unknown>>;
}>;

type QueryProjectionAuthority = ProjectionDeclaration & Readonly<{
  projectionAuthorityType: "query-result-projection.v1";
  scope: "each-row" | "complete-result";
  accepts: Readonly<{ contractId: string }>;
  produces: Readonly<{ contractId: string }>;
  missingValuePolicy: "reject-query" | "reject-row" | "omit-field" | "write-null" | "use-declared-default";
  invalidRowPolicy: string;
  cardinalityPolicy: string;
  additionalFieldPolicy: string;
  orderingPolicy: string;
}>;

type ResolvedProjection = Readonly<{
  resolvedProjectionType: "resolved-query-projection.v1";
  projectionId: string;
  authorityHash: string;
  scope: "each-row" | "complete-result";
  inputContractId: string;
  outputContractId: string;
  policies: Readonly<{
    missingValue: QueryProjectionAuthority["missingValuePolicy"];
    invalidRow: string;
    cardinality: string;
    additionalField: string;
    ordering: string;
  }>;
  projectionDeclaration: QueryProjectionAuthority;
}>;

type ResolvedProjectionExecutionContext = Readonly<{
  request: JsonObject;
  resolvedProjection: ResolvedProjection;
}>;

const validator = createsJsonSchemaValidator([
  queryResultEnvelopeSchema,
  projectedResultSchema,
]);

export function registersSemanticProjectionAuthority(
  kernel: SemanticKernel,
  options: SemanticProjectionRuntimeOptions,
): SemanticEdges {
  kernel.registerCapabilityPacks([{
    decisions: [
      requiresDecisionDeclaration(projectionAuthorityDecision),
      requiresDecisionDeclaration(missingValueDecision),
      requiresDecisionDeclaration(projectionScopeDecision),
    ],
    projections: [
      requiresProjectionDeclaration(projectedResultProjection),
      requiresProjectionDeclaration(projectionReceiptProjection),
    ],
  }]);

  return Object.freeze({
    invokes: async <TResult = unknown>(semanticIdentity: string, context: unknown): Promise<TResult> => {
      if (semanticIdentity === "resolves-projection-authority") {
        return resolvesProjectionAuthority(kernel, options, context) as Promise<TResult>;
      }
      if (semanticIdentity === "executes-resolved-semantic-projection") {
        return executesResolvedSemanticProjection(kernel, context) as Promise<TResult>;
      }
      if (semanticIdentity === "validates-projection-receipt") {
        return validatesProjectionReceipt(context) as TResult;
      }
      return kernel.edges.invokes<TResult>(semanticIdentity, context);
    },
    projects: <TResult = unknown>(projectionIdentity: string, context: unknown): TResult =>
      kernel.edges.projects<TResult>(projectionIdentity, context),
    projectsCode: (projectorIdentity: string, authority: unknown, codeOptions?: unknown) =>
      kernel.edges.projectsCode(projectorIdentity, authority, codeOptions),
  });
}

async function resolvesProjectionAuthority(
  kernel: SemanticKernel,
  options: SemanticProjectionRuntimeOptions,
  context: unknown,
): Promise<ResolvedProjectionExecutionContext> {
  const bodyContext = requiresRecord(context, "Projection body context must be an object.");
  const request = requiresJsonObject(bodyContext.request, "Projection request must be a JSON object.");
  const inputValidation = validator.validate(applyProjectionInputSchema, request);
  if (!inputValidation.valid) {
    throw new SemanticKernelError("INPUT_CONTRACT_INVALID", "Projection request failed contract validation.", { findings: inputValidation.findings });
  }

  const resolutionContext = requiresJsonObject({
    request,
    ...(options.workspaceProjectionRegistry === undefined ? {} : { workspaceProjectionRegistry: options.workspaceProjectionRegistry }),
    ...(options.sourceOwnedProjectionAuthorities === undefined ? {} : { sourceOwnedProjectionAuthority: options.sourceOwnedProjectionAuthorities }),
  }, "Projection resolution context must be JSON.");
  const source = kernel.resolve("resolves-projection-authority", resolutionContext);
  const authority = await readsResolvedAuthority(options, request, source);
  const selector = requiresRecord(request.selector, "Projection selector must be an object.");
  if (authority.projectionId !== selector.projectionId) {
    throw new SemanticKernelError("PROJECTION_ID_MISMATCH", "Resolved projection authority does not match the requested projection.", {
      requested: selector.projectionId,
      resolved: authority.projectionId,
    });
  }

  return Object.freeze({
    request,
    resolvedProjection: Object.freeze({
      resolvedProjectionType: "resolved-query-projection.v1",
      projectionId: authority.projectionId,
      authorityHash: computesCanonicalJsonHash(authority),
      scope: authority.scope,
      inputContractId: authority.accepts.contractId,
      outputContractId: authority.produces.contractId,
      policies: Object.freeze({
        missingValue: authority.missingValuePolicy,
        invalidRow: authority.invalidRowPolicy,
        cardinality: authority.cardinalityPolicy,
        additionalField: authority.additionalFieldPolicy,
        ordering: authority.orderingPolicy,
      }),
      projectionDeclaration: authority,
    }),
  });
}

async function readsResolvedAuthority(
  options: SemanticProjectionRuntimeOptions,
  request: JsonObject,
  source: JsonValue,
): Promise<QueryProjectionAuthority> {
  const selector = requiresRecord(request.selector, "Projection selector must be an object.");
  if (source === "read-explicit-authority-file") {
    const authorityPath = requiresString(selector.explicitAuthorityPath, "Explicit projection authority path is required.");
    return requiresQueryProjectionAuthority(await readsProjectionAuthorityFile({ workspaceRoot: options.workspaceRoot, authorityPath }));
  }
  if (source === "read-workspace-registered-authority") {
    const projectionId = requiresString(selector.projectionId, "Projection ID is required.");
    const entry = options.workspaceProjectionRegistry?.projections.find((candidate) =>
      candidate.projectionId === projectionId && candidate.status === "accepted");
    if (entry === undefined) throw new SemanticKernelError("PROJECTION_AUTHORITY_NOT_FOUND", `Accepted projection is not registered: ${projectionId}`);
    return requiresQueryProjectionAuthority(await readsProjectionAuthorityFile({
      workspaceRoot: options.workspaceRoot,
      authorityPath: entry.authorityPath,
    }));
  }
  if (source === "read-source-owned-authority") {
    const projectionId = requiresString(selector.projectionId, "Projection ID is required.");
    return requiresQueryProjectionAuthority(options.sourceOwnedProjectionAuthorities?.[projectionId]);
  }
  throw new SemanticKernelError("PROJECTION_AUTHORITY_NOT_FOUND", "No declared projection authority source resolved.");
}

async function executesResolvedSemanticProjection(
  kernel: SemanticKernel,
  context: unknown,
): Promise<JsonObject> {
  const executionContext = requiresResolvedExecutionContext(context);
  const request = executionContext.request;
  const resolvedProjection = executionContext.resolvedProjection;
  const queryResult = requiresRecord(request.queryResult, "Query result must be an object.");
  const rows = queryResult.rows;
  if (!Array.isArray(rows)) throw new SemanticKernelError("QUERY_ROWS_NOT_ARRAY", "Query result rows must be an array.");

  const projectionKernel = createSemanticKernel();
  projectionKernel.catalog.registerProjection(resolvedProjection.projectionDeclaration);
  const scopeExecution = kernel.resolve("resolves-projection-execution-scope", {
    projection: { scope: resolvedProjection.scope },
  });

  try {
    if (scopeExecution === "execute-row-projection") {
      const value = executesRowProjection(projectionKernel, resolvedProjection, request);
      return projectsExecution(kernel, executionContext, value, rows.length, value.length, 0, []);
    }
    const value = executesResultSetProjection(projectionKernel, resolvedProjection, queryResult);
    return projectsExecution(kernel, executionContext, value, rows.length, 1, 0, []);
  } catch (error) {
    if (!(error instanceof SemanticKernelError) || error.code !== "PROJECTION_REQUIRED_PATH_MISSING") throw error;
    const disposition = kernel.resolve("resolves-missing-value-disposition", {
      policy: { missingValue: resolvedProjection.policies.missingValue },
      observed: { requiredSourcePathPresent: false },
    });
    if (disposition !== "reject-row" && disposition !== "reject-query") {
      throw new SemanticKernelError("MISSING_VALUE_POLICY_UNSUPPORTED", `Missing-value disposition is not implemented: ${String(disposition)}`);
    }
    const path = typeof error.details.path === "string" ? error.details.path.replace("$.row.", "$.") : "$";
    return projectsExecution(kernel, executionContext, null, rows.length, 0, resolvedProjection.scope === "each-row" ? 1 : rows.length, [{
      findingId: "required-source-path-missing",
      path,
    }]);
  }
}

function executesRowProjection(
  kernel: SemanticKernel,
  resolvedProjection: ResolvedProjection,
  request: JsonObject,
): JsonValue[] {
  kernel.catalog.registerIteration({
    declarationType: "iteration.v1",
    iterationId: "projects-query-rows-runtime",
    collectionPath: "$.request.queryResult.rows",
    itemContextPath: "$.row",
    projectionId: resolvedProjection.projectionId,
    order: "source",
  });
  return kernel.iterate("projects-query-rows-runtime", { request });
}

function executesResultSetProjection(
  kernel: SemanticKernel,
  resolvedProjection: ResolvedProjection,
  queryResult: Readonly<Record<string, unknown>>,
): JsonValue {
  return kernel.project(resolvedProjection.projectionId, requiresJsonValue(queryResult, "Query result must contain JSON values."));
}

function projectsExecution(
  kernel: SemanticKernel,
  context: ResolvedProjectionExecutionContext,
  value: JsonValue,
  inputCount: number,
  projectedCount: number,
  rejectedCount: number,
  findings: readonly JsonObject[],
): JsonObject {
  const request = context.request;
  const queryResult = requiresRecord(request.queryResult, "Query result must be an object.");
  const query = requiresRecord(queryResult.query, "Query identity must be an object.");
  const source = requiresRecord(queryResult.source, "Query source must be an object.");
  const disposition = findings.length === 0 ? "QUERY_RESULT_PROJECTED" : "QUERY_PROJECTION_REJECTED";
  const projectionInput = {
    resolvedProjection: context.resolvedProjection,
    value,
    counts: { input: inputCount, projected: projectedCount, rejected: rejectedCount },
    diagnostics: findings,
  };
  const projectedResult = findings.length === 0
    ? kernel.project("projects-projected-result", requiresJsonObject(projectionInput, "Projected result input must be JSON."))
    : null;
  if (projectedResult !== null) {
    const projectedResultValidation = validator.validate(projectedResultSchema, projectedResult);
    if (!projectedResultValidation.valid) {
      throw new SemanticKernelError("OUTPUT_CONTRACT_INVALID", "Projected result failed contract validation.", {
        findings: projectedResultValidation.findings,
      });
    }
  }
  const resultHash = computesCanonicalJsonHash(projectedResult ?? findings);
  return requiresJsonObject({
    ...projectionInput,
    runId: `run-${requiresString(request.requestId, "Request ID is required.")}`,
    capabilityAuthorityHash: computesCanonicalJsonHash(capabilityAuthority),
    requestHash: computesCanonicalJsonHash(request),
    resultHash,
    disposition,
    findings,
    queryHash: requiresString(query.queryHash, "Query hash is required."),
    sourceHashes: [requiresString(source.sourceHash, "Source hash is required.")],
    projectedResult,
  }, "Projection execution must be JSON.");
}

function validatesProjectionReceipt(value: unknown): JsonObject {
  const receipt = requiresJsonObject(value, "Projection receipt must be a JSON object.");
  const receiptValidation = validator.validate(projectionReceiptSchema, receipt);
  if (!receiptValidation.valid) {
    throw new SemanticKernelError("RECEIPT_CONTRACT_INVALID", "Projection receipt failed contract validation.", {
      findings: receiptValidation.findings,
    });
  }
  return receipt;
}

function requiresResolvedExecutionContext(value: unknown): ResolvedProjectionExecutionContext {
  const candidate = requiresRecord(value, "Resolved projection execution context must be an object.");
  const request = requiresJsonObject(candidate.request, "Resolved projection request must be a JSON object.");
  const resolved = requiresRecord(candidate.resolvedProjection, "Resolved projection authority must be an object.");
  const authority = requiresQueryProjectionAuthority(resolved.projectionDeclaration);
  return Object.freeze({
    request,
    resolvedProjection: Object.freeze({
      resolvedProjectionType: "resolved-query-projection.v1",
      projectionId: requiresString(resolved.projectionId, "Resolved projection ID is required."),
      authorityHash: requiresString(resolved.authorityHash, "Projection authority hash is required."),
      scope: requiresScope(resolved.scope),
      inputContractId: requiresString(resolved.inputContractId, "Input contract ID is required."),
      outputContractId: requiresString(resolved.outputContractId, "Output contract ID is required."),
      policies: requiresPolicies(resolved.policies),
      projectionDeclaration: authority,
    }),
  });
}

function requiresPolicies(value: unknown): ResolvedProjection["policies"] {
  const policies = requiresRecord(value, "Projection policies must be an object.");
  return Object.freeze({
    missingValue: requiresMissingValuePolicy(policies.missingValue),
    invalidRow: requiresString(policies.invalidRow, "Invalid-row policy is required."),
    cardinality: requiresString(policies.cardinality, "Cardinality policy is required."),
    additionalField: requiresString(policies.additionalField, "Additional-field policy is required."),
    ordering: requiresString(policies.ordering, "Ordering policy is required."),
  });
}

function requiresQueryProjectionAuthority(value: unknown): QueryProjectionAuthority {
  const candidate = requiresRecord(value, "Projection authority must be an object.");
  if (candidate.declarationType !== "projection.v1" || candidate.projectionAuthorityType !== "query-result-projection.v1") {
    throw new SemanticKernelError("PROJECTION_AUTHORITY_INVALID", "Projection authority does not implement the kernel projection contract.");
  }
  const accepts = requiresRecord(candidate.accepts, "Projection accepts contract is required.");
  const produces = requiresRecord(candidate.produces, "Projection produces contract is required.");
  requiresString(candidate.projectionId, "Projection ID is required.");
  requiresScope(candidate.scope);
  requiresString(accepts.contractId, "Projection input contract ID is required.");
  requiresString(produces.contractId, "Projection output contract ID is required.");
  requiresRecord(candidate.expression, "Projection expression is required.");
  requiresMissingValuePolicy(candidate.missingValuePolicy);
  for (const policy of ["invalidRowPolicy", "cardinalityPolicy", "additionalFieldPolicy", "orderingPolicy"] as const) {
    requiresString(candidate[policy], `Projection ${policy} is required.`);
  }
  return candidate as unknown as QueryProjectionAuthority;
}

function requiresDecisionDeclaration(value: unknown): DecisionDeclaration {
  const candidate = requiresRecord(value, "Decision declaration must be an object.");
  if (candidate.declarationType !== "decision.v1" || !Array.isArray(candidate.rules)) {
    throw new SemanticKernelError("DECISION_DECLARATION_INVALID", "Decision declaration does not implement the kernel contract.");
  }
  return candidate as unknown as DecisionDeclaration;
}

function requiresProjectionDeclaration(value: unknown): ProjectionDeclaration {
  const candidate = requiresRecord(value, "Projection declaration must be an object.");
  if (candidate.declarationType !== "projection.v1" || !isRecord(candidate.expression)) {
    throw new SemanticKernelError("PROJECTION_DECLARATION_INVALID", "Projection declaration does not implement the kernel contract.");
  }
  return candidate as unknown as ProjectionDeclaration;
}

function requiresScope(value: unknown): "each-row" | "complete-result" {
  if (value !== "each-row" && value !== "complete-result") {
    throw new SemanticKernelError("PROJECTION_SCOPE_INVALID", `Unsupported projection scope: ${String(value)}`);
  }
  return value;
}

function requiresMissingValuePolicy(value: unknown): QueryProjectionAuthority["missingValuePolicy"] {
  if (!["reject-query", "reject-row", "omit-field", "write-null", "use-declared-default"].includes(String(value))) {
    throw new SemanticKernelError("MISSING_VALUE_POLICY_INVALID", `Unsupported missing-value policy: ${String(value)}`);
  }
  return value as QueryProjectionAuthority["missingValuePolicy"];
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
