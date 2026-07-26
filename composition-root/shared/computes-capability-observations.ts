import {
  createSemanticKernel,
  SemanticKernelError,
  type DecisionDeclaration,
  type ExecutionModel,
  type JsonObject,
  type JsonValue,
  type ProjectionDeclaration,
  type ProjectionExpression,
} from "@deterministic-solutions/semantic-kernel";
import keyConflictDecision from "../../capabilities/composes-semantic-authority/1-semantic-authority/decisions/resolves-key-conflict-disposition.sej.v1.json" with { type: "json" };
import defectDecision from "../../capabilities/lints-semantic-authority/1-semantic-authority/decisions/resolves-declaration-defects.sej.v1.json" with { type: "json" };
import delegationStepProjection from "../../capabilities/projects-language-delegation-shell/2-semantic-projections/projects-delegation-step.sej.v1.json" with { type: "json" };
import { computesCanonicalJsonHash } from "../../capabilities/applies-semantic-projection/4-adapters/typescript/computes-canonical-json-hash.js";
import { requiresJsonObject, requiresJsonValue, requiresRecord, requiresString } from "./creates-capability-runtime.js";

export { computesCanonicalJsonHash };

export type QueryColumn = Readonly<{ name: string; sourcePath: string }>;

/**
 * Contract guard. Irreducible mechanical assertion; carries no capability
 * meaning.
 */
export function requiresArray(value: unknown, message: string): JsonValue[] {
  if (!Array.isArray(value)) {
    throw new SemanticKernelError("ARRAY_REQUIRED", message);
  }
  return value as JsonValue[];
}

export function readsColumns(value: unknown): QueryColumn[] {
  const absent = value === undefined;
  return absent
    ? []
    : requiresArray(value, "Columns must be an array.").map((entry) => {
      const record = requiresRecord(entry, "Column must be an object.");
      return Object.freeze({
        name: requiresString(record.name, "Column name is required."),
        sourcePath: requiresString(record.sourcePath, "Column source path is required."),
      });
    });
}

/**
 * Operators the kernel predicate contract declares. Reported as an observation
 * so an undeclared operator is rejected by declared authority rather than
 * surfacing as a kernel evaluation error.
 */
const declaredPredicateOperators: ReadonlySet<string> = new Set([
  "always", "equals", "not-equals", "greater-than", "greater-than-or-equal",
  "less-than", "less-than-or-equal", "contains", "exists", "absent",
  "truthy", "falsy", "matches-pattern", "all", "any", "not",
]);

export function isDeclaredPredicateOperator(value: unknown): boolean {
  const absent = value === undefined || value === null;
  const operator = absent ? undefined : requiresRecord(value, "Predicate must be an object.").operator;
  return typeof operator === "string" && declaredPredicateOperators.has(operator);
}

/**
 * Evaluates a declared kernel predicate against each row. The predicate is
 * evaluated by the kernel, never reimplemented here.
 */
export function evaluatesRowPredicate(
  rows: JsonValue[],
  predicate: JsonObject,
): JsonValue[] {
  const kernel = createSemanticKernel();
  kernel.catalog.registerProjection({
    declarationType: "projection.v1",
    projectionId: "retains-matching-rows",
    expression: {
      kind: "filter",
      collection: { kind: "read", path: "$.rows", required: true },
      itemPath: "$.row",
      when: predicate as never,
    },
  });
  const retained = kernel.project("retains-matching-rows", { rows: rows as JsonValue });
  return requiresArray(retained, "Filtered rows must be an array.");
}

/**
 * Projects each row through a declared kernel projection expression using the
 * kernel's iteration primitive, honoring the resolved order.
 */
export function projectsRowsThroughKernel(
  rows: JsonValue[],
  rowProjection: JsonObject,
  order: string,
): JsonValue[] {
  const kernel = createSemanticKernel();
  kernel.catalog.registerProjection({
    declarationType: "projection.v1",
    projectionId: "projects-declared-row",
    expression: rowProjection as unknown as ProjectionExpression,
  });
  kernel.catalog.registerIteration({
    declarationType: "iteration.v1",
    iterationId: "projects-declared-rows",
    collectionPath: "$.rows",
    itemContextPath: "$.row",
    projectionId: "projects-declared-row",
    order: order === "reverse" ? "reverse" : "source",
  });
  return kernel.iterate("projects-declared-rows", { rows: rows as JsonValue });
}

/**
 * Applies a declared whole-result projection exactly once.
 */
export function projectsCompleteResultThroughKernel(
  rows: JsonValue[],
  resultProjection: JsonObject,
): JsonValue {
  const kernel = createSemanticKernel();
  kernel.catalog.registerProjection({
    declarationType: "projection.v1",
    projectionId: "projects-declared-complete-result",
    expression: resultProjection as unknown as ProjectionExpression,
  });
  return kernel.project("projects-declared-complete-result", { rows: rows as JsonValue });
}

/**
 * Renders a projected value into its declared physical form. Canonical JSON
 * sorts object keys so rendering is byte-stable.
 */
/**
 * Serializes into the form the declared decision already resolved. This is a
 * mechanical serializer lookup, not a choice of form — `resolves-render-form`
 * owns which form applies, and an unseated form is a declared kernel error.
 */
export function rendersDeclaredForm(renderForm: string, value: JsonValue): string {
  const renderers = new Map<string, () => string>([
    ["render-canonical-json", () => JSON.stringify(canonicalizes(value), null, 2)],
    ["render-row-table", () => rendersRowTable(value)],
    ["render-single-value", () => JSON.stringify(canonicalizes(value))],
  ]);
  const renderer = renderers.get(renderForm);
  if (renderer === undefined) {
    throw new SemanticKernelError("RENDER_FORM_UNSUPPORTED", `No serializer is seated for resolved form: ${renderForm}`);
  }
  return renderer();
}

function rendersRowTable(value: JsonValue): string {
  const rows = requiresArray(value, "Row-table rendering requires an array.");
  const columns = [...new Set(rows.flatMap((row) => Object.keys(requiresRecord(row, "Row must be an object."))))].sort();
  const header = columns.join(" | ");
  const body = rows.map((row) => {
    const record = requiresRecord(row, "Row must be an object.");
    return columns.map((column) => JSON.stringify(record[column] ?? null)).join(" | ");
  });
  return [header, ...body].join("\n");
}

function canonicalizes(value: JsonValue): JsonValue {
  const isArray = Array.isArray(value);
  const isObject = value !== null && typeof value === "object" && !isArray;
  const asArray = () => (value as readonly JsonValue[]).map(canonicalizes) as JsonValue;
  const asObject = () => Object.fromEntries(
    Object.entries(value as JsonObject)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, canonicalizes(entry as JsonValue)]),
  ) as JsonValue;
  return isArray ? asArray() : isObject ? asObject() : value;
}

export function indexesAuthorityDocuments(payload: JsonObject, scope: string): JsonValue[] {
  const paths = scope === "index-explicit-paths"
    ? requiresArray(payload.explicitPaths, "Explicit paths are required.")
    : requiresArray(payload.declaredRoots, "Declared roots are required.");
  return paths.map((entry) => {
    const relativePath = requiresString(entry, "Indexed path must be a string.");
    return Object.freeze({
      relativePath,
      indexScope: scope,
      pathHash: computesCanonicalJsonHash(relativePath),
    });
  });
}

export function selectsMatchingEntries(
  entries: JsonValue[],
  payload: JsonObject,
): JsonValue[] {
  const identity = payload.identity;
  const byIdentity = identity !== undefined;
  const selector = payload.selector === undefined ? {} : requiresJsonObject(payload.selector, "Selector must be a JSON object.");
  return entries.filter((entry) => {
    const record = requiresRecord(entry, "Entry must be an object.");
    return byIdentity
      ? record.identity === identity
      : Object.entries(selector).every(([key, value]) => record[key] === value);
  });
}

export function matchesByMetadata(payload: JsonObject): JsonValue[] {
  const entries = requiresArray(payload.entries, "Entries are required.");
  const metadata = Object.entries(requiresJsonObject(payload.metadata, "Metadata must be a JSON object."));
  const matchAll = payload.matchMode === "all";
  return entries.filter((entry) => {
    const record = requiresRecord(entry, "Entry must be an object.");
    const predicate = ([key, value]: readonly [string, unknown]) => record[key] === value;
    return matchAll ? metadata.every(predicate) : metadata.some(predicate);
  });
}

/**
 * Reports, per redeclared key, the facts the conflict decision consumes. What
 * counts as a conflict is resolved by `resolves-key-conflict-disposition`; this
 * function never classifies.
 */
export function observesDeclaredKeys(declarations: JsonValue[]): JsonObject[] {
  const entries = declarations.flatMap((declaration) =>
    Object.entries(requiresRecord(declaration, "Declaration must be an object."))
      .map(([key, value]) => Object.freeze({ key, valueHash: computesCanonicalJsonHash(value) })));

  return entries.map((entry, index) => {
    const earlier = entries.slice(0, index).filter((candidate) => candidate.key === entry.key);
    const previous = earlier.at(-1);
    return Object.freeze({
      key: entry.key,
      observed: Object.freeze({
        keyPreviouslyDeclared: earlier.length > 0,
        valueHashesEqual: previous?.valueHash === entry.valueHash,
      }),
    }) as JsonObject;
  });
}

/**
 * Resolves conflicting keys through declared authority. The kernel decides per
 * key; this collects the keys whose resolved disposition is a conflict.
 */
export function findsCompositionConflicts(declarations: JsonValue[]): string[] {
  const kernel = createSemanticKernel();
  kernel.catalog.registerDecision(keyConflictDecision as unknown as DecisionDeclaration);
  const resolved = observesDeclaredKeys(declarations).map((observation) => Object.freeze({
    key: requiresString(observation.key, "Observed key is required."),
    disposition: kernel.resolve("resolves-key-conflict-disposition", observation),
  }));
  const conflicting = resolved.filter((entry) => entry.disposition === "record-conflicting-declaration");
  return [...new Set(conflicting.map((entry) => entry.key))].sort();
}

export function composesDeclarations(declarations: JsonValue[], precedence: string): JsonObject {
  const ordered = precedence === "earlier-declaration-wins" ? [...declarations].reverse() : declarations;
  const composed = ordered.reduce<Record<string, unknown>>(
    (accumulator, declaration) => ({ ...accumulator, ...requiresRecord(declaration, "Declaration must be an object.") }),
    {},
  );
  return requiresJsonObject(composed, "Composed authority must be JSON.");
}

export function joinsAuthorityRows(payload: JsonObject, joinKind: string): JsonValue[] {
  const left = requiresArray(payload.left, "Left rows are required.");
  const right = requiresArray(payload.right, "Right rows are required.");
  const joinKey = requiresString(payload.joinKey, "Join key is required.");
  const leftOuter = joinKind === "left-outer-join";
  return left.flatMap((leftRow) => {
    const leftRecord = requiresRecord(leftRow, "Left row must be an object.");
    const matches = right.filter((rightRow) =>
      requiresRecord(rightRow, "Right row must be an object.")[joinKey] === leftRecord[joinKey]);
    const joined = matches.map((rightRow) =>
      requiresJsonObject({ ...leftRecord, ...requiresRecord(rightRow, "Right row must be an object.") }, "Joined row must be JSON."));
    const unmatched = leftOuter ? [requiresJsonObject(leftRecord, "Left row must be JSON.")] : [];
    return joined.length === 0 ? unmatched : joined;
  });
}

export function classifiesOverlay(payload: JsonObject): Readonly<{ loosening: string[]; tightening: string[] }> {
  const base = requiresJsonObject(payload.basePolicy, "Base policy must be a JSON object.");
  const overlay = requiresJsonObject(payload.overlay, "Overlay must be a JSON object.");
  const entries = Object.entries(overlay);
  return Object.freeze({
    loosening: entries.filter(([key, value]) => base[key] === true && value === false).map(([key]) => key).sort(),
    tightening: entries.filter(([key, value]) => base[key] !== true && value === true).map(([key]) => key).sort(),
  });
}

export function appliesOverlay(payload: JsonObject): JsonObject {
  const base = requiresJsonObject(payload.basePolicy, "Base policy must be a JSON object.");
  const overlay = requiresJsonObject(payload.overlay, "Overlay must be a JSON object.");
  const tightened = Object.fromEntries(
    Object.entries(overlay).filter(([key, value]) => base[key] !== true && value === true),
  );
  return requiresJsonObject({ ...base, ...tightened }, "Effective policy must be JSON.");
}

/**
 * Reports structural facts about a declaration. Reports only: which facts
 * constitute a defect, and whether a defect blocks, is declared by
 * `resolves-declaration-defect-severity`.
 */
export function observesDeclarationStructure(declaration: JsonObject): JsonObject {
  const rules: JsonValue[] = Array.isArray(declaration.rules) ? declaration.rules : [];
  const identityFields = ["decisionId", "projectionId", "capabilityId", "executionModelId", "iterationId"];
  const alwaysIndex = rules.findIndex((rule) =>
    readsPredicateOperator(rule) === "always");

  return Object.freeze({
    hasIdentity: identityFields.some((field) =>
      typeof declaration[field] === "string" && String(declaration[field]).length > 0),
    ruleCount: rules.length,
    hasNoMatchDisposition: declaration.noMatchDisposition !== undefined,
    hasUnreachableRule: alwaysIndex >= 0 && alwaysIndex < rules.length - 1,
  }) as JsonObject;
}

function readsPredicateOperator(rule: JsonValue): JsonValue {
  const record = requiresRecord(rule, "Rule must be an object.");
  const when = record.when;
  const absent = when === undefined;
  return absent ? null : requiresJsonValue(
    requiresRecord(when, "Predicate must be an object.").operator ?? null,
    "Predicate operator must be JSON.",
  );
}

/**
 * Resolves each declared defect rule against the observed structure through the
 * kernel. Severity is read from the decision, never assigned here.
 */
export function lintsDeclaration(declaration: JsonObject): JsonObject[] {
  const observation = observesDeclarationStructure(declaration);
  const kernel = createSemanticKernel();
  const declared = defectDecision as unknown as DecisionDeclaration;

  /**
   * Each defect rule is resolved in isolation so every applicable defect is
   * reported, rather than only the first rule the decision table matches.
   */
  const resolvedDefects = declared.rules.map((rule) => {
    kernel.catalog.registerDecision({
      declarationType: "decision.v1",
      decisionId: `resolves-${rule.ruleId}`,
      rules: [rule],
      noMatchDisposition: "return-null",
    });
    return Object.freeze({
      defectId: rule.ruleId,
      severity: kernel.resolve(`resolves-${rule.ruleId}`, Object.freeze({ observed: observation })),
    });
  });

  return resolvedDefects
    .filter((defect) => defect.severity === "blocking" || defect.severity === "advisory")
    .map((defect) => Object.freeze({ defectId: defect.defectId, severity: defect.severity }) as JsonObject);
}

export function findsMissingBindings(payload: JsonObject): string[] {
  const required = requiresArray(payload.requiredBindings, "Required bindings are required.");
  const provided = requiresJsonObject(payload.providedBindings, "Provided bindings must be a JSON object.");
  return required
    .map((binding) => requiresString(binding, "Binding name must be a string."))
    .filter((binding) => provided[binding] === undefined)
    .sort();
}

export function constructsExecutionContext(payload: JsonObject): JsonObject {
  const provided = requiresJsonObject(payload.providedBindings, "Provided bindings must be a JSON object.");
  const limits = payload.limits === undefined ? {} : requiresJsonObject(payload.limits, "Limits must be a JSON object.");
  return requiresJsonObject({
    executionContextType: "semantic-execution-context.v1",
    bindings: provided,
    limits,
    contextHash: computesCanonicalJsonHash({ bindings: provided, limits }),
  }, "Execution context must be JSON.");
}

/**
 * Executes a declared execution model through the kernel execution engine and
 * returns the kernel's receipt unaltered.
 */
export async function executesSubgraphThroughKernel(payload: JsonObject): Promise<JsonValue> {
  const kernel = createSemanticKernel();
  const model = requiresJsonObject(payload.executionModel, "Execution model must be a JSON object.");
  kernel.catalog.registerProjection({
    declarationType: "projection.v1",
    projectionId: "projects-demo-row-count",
    expression: {
      kind: "object",
      fields: { total: { kind: "count", expression: { kind: "read", path: "$.input.rows", required: true } } },
    },
  });
  kernel.catalog.registerExecution(model as unknown as ExecutionModel);
  const receipt = await kernel.execute(
    requiresString(model.executionModelId, "Execution model ID is required."),
    requiresJsonObject({ input: payload.input }, "Execution input must be JSON."),
  );
  return requiresJsonValue(JSON.parse(JSON.stringify(receipt)), "Kernel receipt must be JSON.");
}

export function explainsRecordedTestimony(payload: JsonObject, depth: string): JsonValue[] {
  const receipt = requiresJsonObject(payload.receipt, "Receipt must be a JSON object.");
  const steps = requiresArray(receipt.steps, "Receipt steps are required.");
  const decisionsOnly = depth === "explain-decisions-only";
  const selected = decisionsOnly
    ? steps.filter((step) => requiresRecord(step, "Step must be an object.").operation === "resolve-decision")
    : steps;
  return selected.map((step) => {
    const record = requiresRecord(step, "Step must be an object.");
    return Object.freeze({
      stepId: requiresString(record.stepId, "Step ID is required."),
      operation: requiresString(record.operation, "Step operation is required."),
      disposition: requiresString(record.disposition, "Step disposition is required."),
      governedBy: requiresJsonValue(record.output ?? null, "Step output must be JSON."),
    });
  });
}

export function findsMissingAssertions(payload: JsonObject): string[] {
  const required = requiresArray(payload.requiredAssertions, "Required assertions are required.");
  const testimony = requiresJsonObject(payload.testimony, "Testimony must be a JSON object.");
  return required
    .map((assertion) => requiresString(assertion, "Assertion name must be a string."))
    .filter((assertion) => testimony[assertion] === undefined)
    .sort();
}

export function projectsProofFromTestimony(payload: JsonObject): JsonObject {
  const testimony = requiresJsonObject(payload.testimony, "Testimony must be a JSON object.");
  return requiresJsonObject({
    proofType: "semantic-proof.v1",
    assertions: testimony,
    proofHash: computesCanonicalJsonHash(testimony),
  }, "Proof must be JSON.");
}

export function derivesCandidates(payload: JsonObject): JsonValue[] {
  const declaration = requiresJsonObject(payload.declaration, "Declaration must be a JSON object.");
  const perRule = payload.derivationScope === "decision-rule";
  const rules: JsonValue[] = Array.isArray(declaration.rules) ? declaration.rules : [];
  const fields = declaration.expression !== undefined
    ? Object.keys(requiresRecord(requiresRecord(declaration.expression, "Expression must be an object.").fields ?? {}, "Fields must be an object."))
    : [];
  const fromRules = rules.map((rule) => {
    const record = requiresRecord(rule, "Rule must be an object.");
    return Object.freeze({
      candidateType: "conformance-vector-candidate.v1",
      derivedFrom: requiresString(record.ruleId, "Rule ID is required."),
      status: "candidate",
      promotionRequired: true,
    });
  });
  const fromFields = fields.map((field) => Object.freeze({
    candidateType: "conformance-vector-candidate.v1",
    derivedFrom: field,
    status: "candidate",
    promotionRequired: true,
  }));
  return perRule ? fromRules : fromFields;
}

export function findsMissingPrimitives(payload: JsonObject): string[] {
  const required = requiresArray(payload.requiredPrimitives, "Required primitives are required.");
  const seated = new Set(requiresArray(payload.seatedPrimitives, "Seated primitives are required.").map(String));
  return required.map(String).filter((primitive) => !seated.has(primitive)).sort();
}

/**
 * Projects each declared execution step into a delegation-shell step through
 * the kernel. Which edge a step delegates through is declared by
 * `projects-delegation-step`, not chosen here.
 */
export function projectsDelegationShell(payload: JsonObject): Readonly<{ steps: JsonValue[]; lineCount: number }> {
  const model = requiresJsonObject(payload.executionModel, "Execution model must be a JSON object.");
  const steps = requiresArray(model.steps, "Execution model steps are required.");
  const kernel = createSemanticKernel();
  kernel.catalog.registerProjection(delegationStepProjection as unknown as ProjectionDeclaration);
  const projected = steps.map((step) => kernel.project("projects-delegation-step", { step }));
  return Object.freeze({ steps: projected, lineCount: projected.length + 3 });
}
