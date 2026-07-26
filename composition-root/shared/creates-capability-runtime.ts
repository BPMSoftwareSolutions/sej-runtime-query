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
import { computesCanonicalJsonHash } from "../../capabilities/applies-semantic-projection/4-adapters/typescript/computes-canonical-json-hash.js";
import { createsJsonSchemaValidator } from "../../capabilities/applies-semantic-projection/4-adapters/typescript/validates-json-schema.js";

/**
 * Observation computed below the decision boundary. An observer may only read
 * declared input and report facts; it never chooses a disposition. The declared
 * decision consumes these facts and resolves the outcome.
 */
export type CapabilityObserver = (payload: JsonObject) => JsonObject;

/**
 * Execution computed after the decision resolves. Receives the resolved rule
 * and produces the value the declared result projection reads from.
 */
export type CapabilityExecutor = (
  payload: JsonObject,
  decision: JsonValue,
  observation: JsonObject,
) => JsonObject | Promise<JsonObject>;

export type CapabilityAuthorityDeclarations = Readonly<{
  capabilityId: string;
  capabilityAuthority: unknown;
  decision: unknown;
  resultProjection: unknown;
  inputSchema: unknown;
  resultSchema: unknown;
  receiptSchema: unknown;
  contractSchemas?: readonly unknown[];
  successDisposition: string;
  failureDisposition: string;
  rejectionRules: readonly string[];
  observes: CapabilityObserver;
  executes: CapabilityExecutor;
}>;

export type CapabilityRuntime = Readonly<{
  kernel: SemanticKernel;
  edges: SemanticEdges;
  invoke(request: unknown): Promise<JsonObject>;
}>;

/**
 * Seats one capability's declared authority on a kernel and returns the edges
 * its runtime body delegates through. Every edge below is a declared semantic
 * identity; the body itself contains no control flow.
 */
export function createsCapabilityRuntime(
  declarations: CapabilityAuthorityDeclarations,
): CapabilityRuntime {
  const kernel = createSemanticKernel();
  const decision = requiresDecisionDeclaration(declarations.decision);
  const resultProjection = requiresProjectionDeclaration(declarations.resultProjection);
  kernel.registerCapabilityPacks([{ decisions: [decision], projections: [resultProjection] }]);

  const validator = createsJsonSchemaValidator(declarations.contractSchemas);
  const authorityHash = computesCanonicalJsonHash(declarations.capabilityAuthority);
  const rejectionRules = new Set(declarations.rejectionRules);

  const edges: SemanticEdges = Object.freeze({
    invokes: async <TResult = unknown>(semanticIdentity: string, context: unknown): Promise<TResult> => {
      const resolved = resolvesEdge(semanticIdentity, context);
      return resolved as TResult;
    },
    projects: <TResult = unknown>(projectionIdentity: string, context: unknown): TResult =>
      kernel.project(projectionIdentity, requiresJsonValue(context, "Projection context must be JSON.")) as TResult,
  });

  function resolvesEdge(semanticIdentity: string, context: unknown): JsonObject | Promise<JsonObject> {
    const authorityEdge = `resolves-${declarations.capabilityId}-authority`;
    const executionEdge = `executes-resolved-${declarations.capabilityId}`;
    const validationEdge = `validates-${declarations.capabilityId}-receipt`;
    const dispatch = new Map<string, () => JsonObject | Promise<JsonObject>>([
      [authorityEdge, () => resolvesAuthority(context)],
      [executionEdge, () => executesResolved(context)],
      [validationEdge, () => validatesReceipt(context)],
    ]);
    const handler = dispatch.get(semanticIdentity);
    requiresPresent(handler, "SEMANTIC_IDENTITY_UNDECLARED", `No declared authority for edge: ${semanticIdentity}`);
    return (handler as () => JsonObject | Promise<JsonObject>)();
  }

  function resolvesAuthority(context: unknown): JsonObject {
    const bodyContext = requiresRecord(context, "Capability body context must be an object.");
    const request = requiresJsonObject(bodyContext.request, "Capability request must be a JSON object.");
    const inputValidation = validator.validate(declarations.inputSchema, request);
    requiresValid(inputValidation, "INPUT_CONTRACT_INVALID", "Capability request failed contract validation.");

    const payload = requiresJsonObject(request.payload, "Capability payload must be a JSON object.");
    const observation = declarations.observes(payload);
    const decisionContext = requiresJsonObject({ payload, ...observation }, "Decision context must be JSON.");
    const resolvedRule = findsResolvedRule(decision, decisionContext);
    /**
     * `noMatchDisposition: reject` means no declared rule governs this input.
     * That is a declared outcome, so it is recorded as the capability's failure
     * disposition rather than escaping as an unclassified exception.
     */
    const unmatched = resolvedRule === null;
    const resolved = unmatched ? null : kernel.resolve(decision.decisionId, decisionContext);

    return Object.freeze({
      request,
      payload,
      observation,
      decision: resolved,
      resolvedRule,
      unmatched,
      authorityHash,
    });
  }

  async function executesResolved(context: unknown): Promise<JsonObject> {
    const resolvedContext = requiresRecord(context, "Resolved authority context must be an object.");
    const request = requiresJsonObject(resolvedContext.request, "Resolved request must be a JSON object.");
    const payload = requiresJsonObject(resolvedContext.payload, "Resolved payload must be a JSON object.");
    const observation = requiresJsonObject(resolvedContext.observation, "Observation must be a JSON object.");
    const resolved = requiresJsonValue(resolvedContext.decision, "Resolved decision must be JSON.");
    const resolvedRule = resolvedContext.resolvedRule;
    const unmatched = resolvedContext.unmatched === true;
    const ruleRejected = rejectionRules.has(String(resolvedRule));

    const unmatchedFinding = Object.freeze({
      findingId: "no-declared-rule-matched",
      detail: Object.freeze({ decisionId: decision.decisionId, observation }),
    });
    const ruleFinding = Object.freeze({ findingId: String(resolved), detail: observation });

    /**
     * A declared execution may still fail inside the kernel — a missing required
     * projection path, an invalid predicate. That is a declared failure of this
     * capability, recorded as a finding, not an unclassified escape.
     */
    const attempted = unmatched || ruleRejected
      ? Object.freeze({ executed: Object.freeze({ payload, decision: resolved }), failure: null })
      : await attemptsDeclaredExecution(() => declarations.executes(payload, resolved, observation), payload, resolved);

    const executionFailed = attempted.failure !== null;
    const rejected = unmatched || ruleRejected || executionFailed;
    const findings = unmatched
      ? [unmatchedFinding]
      : ruleRejected
        ? [ruleFinding]
        : executionFailed
          ? [attempted.failure as JsonObject]
          : [];

    return Object.freeze({
      request,
      payload,
      decision: resolved,
      resolvedRule: requiresJsonValue(resolvedRule ?? null, "Resolved rule must be JSON."),
      rejected,
      findings,
      executed: requiresJsonObject(attempted.executed, "Capability execution must be JSON."),
    });
  }

  function validatesReceipt(context: unknown): JsonObject {
    const receipt = requiresJsonObject(context, "Capability receipt must be a JSON object.");
    const receiptValidation = validator.validate(declarations.receiptSchema, receipt);
    requiresValid(receiptValidation, "RECEIPT_CONTRACT_INVALID", "Capability receipt failed contract validation.");
    return receipt;
  }

  /**
   * Projects the canonical receipt. Result projection runs through the kernel;
   * rejection records findings and omits a result rather than inventing one.
   */
  function projectsReceipt(execution: JsonObject): JsonObject {
    const request = requiresJsonObject(execution.request, "Execution request must be a JSON object.");
    const rejected = execution.rejected === true;
    const findings = requiresJsonValue(execution.findings, "Findings must be JSON.");
    const projectionContext = requiresJsonObject(
      { payload: execution.payload, decision: execution.decision, ...requiresJsonObject(execution.executed, "Executed value must be JSON.") },
      "Result projection context must be JSON.",
    );

    const result = rejected ? null : kernel.project(resultProjection.projectionId, projectionContext);
    const resultValidation = rejected ? { valid: true, findings: [] } : validator.validate(declarations.resultSchema, result);
    requiresValid(resultValidation, "RESULT_CONTRACT_INVALID", "Capability result failed contract validation.");

    return requiresJsonObject({
      receiptType: `${declarations.capabilityId}-receipt.v1`,
      runId: `run-${requiresString(request.requestId, "Request ID is required.")}`,
      capabilityId: declarations.capabilityId,
      authorityHash,
      inputHash: computesCanonicalJsonHash(request),
      resultHash: computesCanonicalJsonHash(rejected ? findings : result),
      decisionId: decision.decisionId,
      resolvedRule: execution.resolvedRule,
      disposition: rejected ? declarations.failureDisposition : declarations.successDisposition,
      findings,
      ...(rejected ? {} : { result }),
    }, "Capability receipt must be JSON.");
  }

  return Object.freeze({
    kernel,
    edges: Object.freeze({
      invokes: edges.invokes,
      projects: <TResult = unknown>(projectionIdentity: string, context: unknown): TResult => {
        const receiptIdentity = `projects-${declarations.capabilityId}-receipt`;
        const isReceipt = projectionIdentity === receiptIdentity;
        const projected = isReceipt
          ? projectsReceipt(requiresJsonObject(context, "Receipt projection context must be JSON."))
          : kernel.project(projectionIdentity, requiresJsonValue(context, "Projection context must be JSON."));
        return projected as TResult;
      },
    }),
    invoke: async (request: unknown): Promise<JsonObject> => {
      const resolved = resolvesAuthority({ request });
      const executed = await executesResolved(resolved);
      return validatesReceipt(projectsReceipt(executed));
    },
  });
}

/**
 * Runs a declared execution and classifies a kernel failure as a recorded
 * finding. Only kernel-declared errors are classified; anything else is a
 * genuine defect and propagates.
 */
async function attemptsDeclaredExecution(
  executes: () => JsonObject | Promise<JsonObject>,
  payload: JsonObject,
  decision: JsonValue,
): Promise<Readonly<{ executed: JsonObject; failure: JsonObject | null }>> {
  return await Promise.resolve()
    .then(executes)
    .then((executed) => Object.freeze({ executed, failure: null }))
    .catch((error: unknown) => {
      /**
       * The catch observes and delegates. Only kernel-declared errors are
       * classified as findings; an unclassified defect propagates rather than
       * being absorbed into a disposition.
       */
      if (!(error instanceof SemanticKernelError)) {
        throw error;
      }
      return Object.freeze({
        executed: Object.freeze({ payload, decision }) as JsonObject,
        failure: Object.freeze({ findingId: error.code, detail: error.message }) as JsonObject,
      });
    });
}

/**
 * Reports which declared rule the kernel matched, so the receipt can name its
 * authority rather than only its outcome.
 */
function findsResolvedRule(decision: DecisionDeclaration, context: JsonObject): string | null {
  const probe = createSemanticKernel();
  const matched = decision.rules.map((rule): JsonValue => {
    probe.catalog.registerDecision({
      declarationType: "decision.v1",
      decisionId: `probes-${rule.ruleId}`,
      rules: [{ ruleId: rule.ruleId, when: rule.when, then: rule.ruleId }],
      noMatchDisposition: "return-null",
    });
    return probe.resolve(`probes-${rule.ruleId}`, context);
  }).filter((value: JsonValue) => typeof value === "string");
  return matched.length === 0 ? null : String(matched[0]);
}

function requiresValid(
  validation: Readonly<{ valid: boolean; findings: readonly unknown[] }>,
  code: string,
  message: string,
): void {
  requiresPresent(validation.valid === true ? validation : undefined, code, message, { findings: validation.findings });
}

/**
 * Contract guard. This is an irreducible mechanical assertion — it carries no
 * capability meaning and selects among no outcomes; it either continues or
 * raises a declared kernel error.
 */
function requiresPresent(
  value: unknown,
  code: string,
  message: string,
  details: Readonly<Record<string, unknown>> = {},
): asserts value {
  if (value === undefined || value === null) {
    throw new SemanticKernelError(code, message, details);
  }
}

function requiresDecisionDeclaration(value: unknown): DecisionDeclaration {
  const candidate = requiresRecord(value, "Decision declaration must be an object.");
  requiresPresent(
    candidate.declarationType === "decision.v1" && Array.isArray(candidate.rules) ? candidate : undefined,
    "DECISION_DECLARATION_INVALID",
    "Decision declaration does not implement the kernel contract.",
  );
  return candidate as unknown as DecisionDeclaration;
}

function requiresProjectionDeclaration(value: unknown): ProjectionDeclaration {
  const candidate = requiresRecord(value, "Projection declaration must be an object.");
  requiresPresent(
    candidate.declarationType === "projection.v1" && isRecord(candidate.expression) ? candidate : undefined,
    "PROJECTION_DECLARATION_INVALID",
    "Projection declaration does not implement the kernel contract.",
  );
  return candidate as unknown as ProjectionDeclaration;
}

export function requiresJsonObject(value: unknown, message: string): JsonObject {
  const candidate = requiresJsonValue(value, message);
  requiresPresent(isRecord(candidate) ? candidate : undefined, "JSON_OBJECT_REQUIRED", message);
  return candidate as JsonObject;
}

/**
 * `null` is a valid JSON value, so validity is signalled separately from
 * presence — otherwise a legitimately null decision would be rejected.
 */
export function requiresJsonValue(value: unknown, message: string): JsonValue {
  requiresPresent(isJsonValue(value) ? true : undefined, "JSON_VALUE_REQUIRED", message);
  return value as JsonValue;
}

function isJsonValue(value: unknown): value is JsonValue {
  const scalar = value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
  const array = Array.isArray(value) && value.every(isJsonValue);
  const object = isRecord(value) && Object.values(value).every(isJsonValue);
  return scalar || array || object;
}

export function requiresRecord(value: unknown, message: string): Readonly<Record<string, unknown>> {
  requiresPresent(isRecord(value) ? value : undefined, "OBJECT_REQUIRED", message);
  return value as Readonly<Record<string, unknown>>;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function requiresString(value: unknown, message: string): string {
  requiresPresent(typeof value === "string" && value.length > 0 ? value : undefined, "STRING_REQUIRED", message);
  return value as string;
}
