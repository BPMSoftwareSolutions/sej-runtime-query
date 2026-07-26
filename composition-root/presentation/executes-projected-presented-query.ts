import { SemanticKernelError, type JsonObject, type JsonValue } from "@deterministic-solutions/semantic-kernel";
import { computesCanonicalJsonHash } from "../../capabilities/applies-semantic-projection/4-adapters/typescript/computes-canonical-json-hash.js";
import { createsJsonSchemaValidator } from "../../capabilities/applies-semantic-projection/4-adapters/typescript/validates-json-schema.js";
import { createsSemanticProjectionCapability } from "../creates-semantic-projection-capability.js";
import { createsQueryResultPresentationRuntime } from "../../capabilities/presents-projected-query-result/runtime/typescript/registration/creates-query-result-presentation-runtime.js";
import projectedPresentedResultSchema from "../../capabilities/presents-projected-query-result/contracts/projected-presented-query-result.schema.v1.json" with { type: "json" };
import presentationReceiptSchema from "../../capabilities/presents-projected-query-result/contracts/query-result-presentation-receipt.schema.v1.json" with { type: "json" };
import presentationModelSchema from "../../capabilities/presents-projected-query-result/contracts/semantic-presentation-model.schema.v1.json" with { type: "json" };
import workspaceProjection from "../../examples/workspaces/projection-demo/.sej-query/projections/project-workspace-capability-report.sej.v1.json" with { type: "json" };

export type RelationalQueryInvocation = (request: unknown) => Promise<unknown>;

export function createsProjectedPresentedQueryExecution(
  invokesRelationalQuery: RelationalQueryInvocation,
): (request: unknown) => Promise<unknown> {
  const semanticProjection = createsSemanticProjectionCapability({
    workspaceRoot: process.cwd(),
    sourceOwnedProjectionAuthorities: {
      "project-workspace-capability-report": workspaceProjection,
    },
  });
  const presentation = createsQueryResultPresentationRuntime();
  const resultValidator = createsJsonSchemaValidator([presentationModelSchema, presentationReceiptSchema]);

  return async (request: unknown): Promise<unknown> => {
    const parsed = parsesPresentedQueryRequest(request);
    const relationalReceipt = requiresRecord(await invokesRelationalQuery(projectsRelationalRequest(parsed)), "Relational receipt is required.");
    const projectionReceipt = requiresRecord(
      await semanticProjection.apply(projectsSemanticProjectionRequest(parsed, relationalReceipt)),
      "Semantic projection receipt is required.",
    );
    const presentationReceipt = await presentation.present({
      requestType: "presents-projected-query-result-request.v1",
      requestId: `${parsed.requestId}-presentation`,
      projectionReceipt,
      surface: "terminal",
    });
    const presentationRecord = requiresRecord(presentationReceipt, "Presentation receipt is required.");
    const result = requiresJsonObject(Object.freeze({
      resultType: "projected-presented-query-result.v1",
      disposition: presentationRecord.disposition,
      relationalReceipt,
      projectionReceipt,
      presentationReceipt,
      rendered: presentationRecord.rendered,
    }), "Projected and presented query result must be JSON.");
    const validation = resultValidator.validate(projectedPresentedResultSchema, result);
    if (!validation.valid) {
      throw new SemanticKernelError(
        "PROJECTED_PRESENTED_QUERY_RESULT_INVALID",
        "Projected and presented query result failed its contract.",
        { findings: validation.findings },
      );
    }
    return Object.freeze(result);
  };
}

type ParsedPresentedQuery = Readonly<{
  requestId: string;
  commandText: string;
  relationalCommandText: string;
  projectionId: string;
  sources: JsonObject;
  queryHash: string;
  sourceHash: string;
}>;

function parsesPresentedQueryRequest(value: unknown): ParsedPresentedQuery {
  const request = requiresRecord(value, "Query request must be an object.");
  const payload = requiresRecord(request.payload, "Query payload must be an object.");
  const commandText = requiresString(payload.commandText, "Command text is required.");
  const match = commandText.match(/^(.*?)\s+APPLY\s+RESULT\s+PROJECTION\s+([A-Za-z0-9_-]+)\s*$/i);
  if (match === null) {
    throw new SemanticKernelError("RESULT_PROJECTION_CLAUSE_REQUIRED", "Presented query requires APPLY RESULT PROJECTION.");
  }
  const relationalCommandText = requiresString(match[1]?.trim(), "Relational query text is required.");
  const projectionId = requiresString(match[2], "Projection identity is required.");
  const sources = requiresJsonObject(payload.sources ?? {}, "Relational sources must be a JSON object.");
  return Object.freeze({
    requestId: requiresString(request.requestId, "Request identity is required."),
    commandText,
    relationalCommandText,
    projectionId,
    sources,
    queryHash: computesCanonicalJsonHash(relationalCommandText),
    sourceHash: computesCanonicalJsonHash(sources),
  });
}

function projectsRelationalRequest(parsed: ParsedPresentedQuery): JsonObject {
  return requiresJsonObject(Object.freeze({
    requestType: "executes-relational-query-request.v1",
    requestId: `${parsed.requestId}-relational`,
    payload: Object.freeze({
      commandText: parsed.relationalCommandText,
      sources: parsed.sources,
    }),
  }), "Relational request must be JSON.");
}

function projectsSemanticProjectionRequest(
  parsed: ParsedPresentedQuery,
  relationalReceipt: Readonly<Record<string, unknown>>,
): JsonObject {
  if (relationalReceipt.disposition !== "RELATIONAL_QUERY_EXECUTED") {
    throw new SemanticKernelError("RELATIONAL_QUERY_EXECUTION_REQUIRED", "Semantic projection requires a successful relational result.");
  }
  const result = requiresRecord(relationalReceipt.result, "Relational result envelope is required.");
  const value = requiresRecord(result.value, "Relational result value is required.");
  const columns = requiresStringArray(value.columns, "Relational result columns are required.");
  const rows = requiresJsonObjectArray(value.rows, "Relational result rows are required.");
  const plan = requiresRecord(value.plan, "Relational query plan is required.");
  return requiresJsonObject(Object.freeze({
    requestType: "apply-semantic-projection-request.v1",
    requestId: `${parsed.requestId}-projection`,
    queryResult: Object.freeze({
      queryResultType: "sej-query-result.v1",
      query: Object.freeze({
        normalizedText: parsed.commandText,
        queryHash: parsed.queryHash,
      }),
      source: Object.freeze({
        sourceId: "relational-sources",
        sourceHash: parsed.sourceHash,
      }),
      selection: Object.freeze({
        columns: Object.freeze(columns.map((column) => Object.freeze({
          name: column,
          sourcePath: `$.${column}`,
        }))),
      }),
      rows,
      rowCount: rows.length,
      execution: Object.freeze({
        whereApplied: plan.where !== undefined,
        limitApplied: typeof plan.limit === "number" ? plan.limit : null,
      }),
    }),
    selector: Object.freeze({ projectionId: parsed.projectionId }),
    projectionContext: Object.freeze({}),
  }), "Semantic projection request must be JSON.");
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

function requiresStringArray(value: unknown, message: string): readonly string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new SemanticKernelError("STRING_ARRAY_REQUIRED", message);
  }
  return value as readonly string[];
}

function requiresJsonObjectArray(value: unknown, message: string): readonly JsonObject[] {
  if (!Array.isArray(value) || value.some((item) => !isRecord(item) || !isJsonValue(item))) {
    throw new SemanticKernelError("JSON_OBJECT_ARRAY_REQUIRED", message);
  }
  return value as readonly JsonObject[];
}
