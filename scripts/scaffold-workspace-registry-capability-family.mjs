import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const manifestPath = path.join(root, "architecture", "workspace-registry-capability-family.scaffold.v1.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const refresh = process.argv.includes("--refresh");
const created = [];
const unchanged = [];
const refreshed = [];

for (const capability of manifest.capabilities) {
  const capabilityRoot = path.join(root, "capabilities", capability.capabilityId);
  const id = capability.capabilityId;
  const pascal = id.split("-").map((part) => `${part[0].toUpperCase()}${part.slice(1)}`).join("");
  const camel = `${pascal[0].toLowerCase()}${pascal.slice(1)}`;
  const inputId = `urn:deterministic-solutions:${id}:input:v1`;
  const resultId = `urn:deterministic-solutions:${id}:result:v1`;
  const receiptId = `urn:deterministic-solutions:${id}:receipt:v1`;
  const executionContextId = `urn:deterministic-solutions:${id}:execution-context:v1`;
  const resolvedAuthorityId = `urn:deterministic-solutions:${id}:resolved-authority:v1`;

  writesText(capabilityRoot, "README.md", [
    `# ${capability.title}`,
    "",
    `This file body is a drafted member of the \`workspace-registry\` capability family.`,
    "Its canonical artifacts are durable scaffolds for a follow-on semantic implementation.",
    "Its TypeScript body is projected from the semantic execution model and must not be",
    "edited independently.",
    "",
    `See [${id}.md](docs/${id}.md) for the owned boundary and implementation handoff.`,
    "",
  ].join("\n"));

  for (const [file, content] of Object.entries(rendersArchitecture(capability))) {
    writesText(capabilityRoot, `architecture/${file}`, content);
  }

  writesJson(capabilityRoot, `intent/${id}.intent-ir.v1.json`, {
    scaffoldType: "capability-intent-scaffold.v1",
    capabilityId: id,
    status: "drafted",
    title: capability.title,
    purpose: capability.purpose,
    actor: capability.actor,
    trigger: capability.trigger,
    desiredOutcome: capability.desiredOutcome,
    constraints: [
      "semantic-authority-is-the-source-of-truth",
      "capability-body-is-projected-and-linear",
      "mechanical-effects-occur-only-through-declared-ports",
      "no-promotion-before-live-kernel-proof",
    ],
    featureIds: [id],
    sourceEvidence: "legacy-workspace-registry-behavior",
  });

  writesText(capabilityRoot, `features/${id}.feature`, [
    `Feature: ${capability.title}`,
    "",
    `  Scenario Outline: ${capability.desiredOutcome}`,
    `    Given the ${id} request satisfies its input contract`,
    "    And the required observations have been reported through declared ports",
    `    When the ${id} capability is invoked`,
    "    Then semantic authority resolves the declared outcome",
    "    And the execution model runs only authorized operations",
    "    And the projected receipt records the final disposition",
    "",
    "    Examples:",
    "      | posture | expected disposition |",
    `      | authorized | ${capability.successDisposition} |`,
    `      | rejected   | ${capability.failureDisposition} |`,
    "",
  ].join("\n"));

  writesJson(capabilityRoot, `contracts/${id}.input.schema.v1.json`, {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: inputId,
    title: `${capability.title} input`,
    type: "object",
    required: ["requestType", "requestId", "payload"],
    properties: {
      requestType: { const: `${id}-request.v1` },
      requestId: { type: "string", minLength: 1 },
      payload: {
        type: "object",
        required: capability.requestFields.filter((field) => field.required).map((field) => field.name),
        properties: Object.fromEntries(capability.requestFields.map((field) => [field.name, fieldSchema(field)])),
        additionalProperties: false,
      },
    },
    additionalProperties: false,
    "x-scaffold-status": "drafted",
  });

  writesJson(capabilityRoot, `contracts/${id}.execution-context.schema.v1.json`, {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: executionContextId,
    title: `${capability.title} execution context`,
    type: "object",
    required: ["request", "observedFacts", "resolvedAuthority", "proofContext"],
    properties: {
      request: { $ref: inputId },
      observedFacts: { type: "object" },
      resolvedAuthority: { $ref: resolvedAuthorityId },
      proofContext: { type: "object" },
    },
    additionalProperties: false,
    "x-scaffold-status": "drafted",
  });

  writesJson(capabilityRoot, `contracts/${id}.resolved-authority.schema.v1.json`, {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: resolvedAuthorityId,
    title: `${capability.title} resolved authority`,
    type: "object",
    required: ["authorityType", "capabilityId", "decisionId", "resolvedDisposition", "operations"],
    properties: {
      authorityType: { const: `resolved-${id}-authority.v1` },
      capabilityId: { const: id },
      decisionId: { const: capability.decisionId },
      resolvedDisposition: { type: "string", minLength: 1 },
      operations: {
        type: "array",
        items: {
          type: "object",
          required: ["sequence", "semanticIdentity"],
          properties: {
            sequence: { type: "integer", minimum: 1 },
            semanticIdentity: { type: "string", minLength: 1 },
          },
          additionalProperties: true,
        },
      },
    },
    additionalProperties: false,
    "x-scaffold-status": "drafted",
  });

  writesJson(capabilityRoot, `contracts/${id}.result.schema.v1.json`, {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: resultId,
    title: `${capability.title} result`,
    type: "object",
    required: ["resultType", "capabilityId", "value"],
    properties: {
      resultType: { const: `${id}-result.v1` },
      capabilityId: { const: id },
      value: {
        type: "object",
        required: capability.resultFields,
        properties: Object.fromEntries(capability.resultFields.map((field) => [field, {}])),
        additionalProperties: false,
      },
    },
    additionalProperties: false,
    "x-scaffold-status": "drafted",
  });

  writesJson(capabilityRoot, `contracts/${id}.receipt.schema.v1.json`, {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: receiptId,
    title: `${capability.title} receipt`,
    type: "object",
    required: [
      "receiptType",
      "runId",
      "capabilityId",
      "authorityHash",
      "inputHash",
      "resultHash",
      "decisionId",
      "disposition",
      "findings",
    ],
    properties: {
      receiptType: { const: `${id}-receipt.v1` },
      runId: { type: "string", minLength: 1 },
      capabilityId: { const: id },
      authorityHash: { type: "string", pattern: "^sha256:[a-f0-9]{64}$" },
      inputHash: { type: "string", pattern: "^sha256:[a-f0-9]{64}$" },
      resultHash: { type: "string", pattern: "^sha256:[a-f0-9]{64}$" },
      decisionId: { const: capability.decisionId },
      resolvedRule: { type: ["string", "null"] },
      disposition: { enum: [capability.successDisposition, capability.failureDisposition] },
      findings: { type: "array", items: { type: "object" } },
      result: { $ref: resultId },
    },
    additionalProperties: false,
    "x-scaffold-status": "drafted",
  });

  writesJson(capabilityRoot, `1-semantic-authority/${id}.capability.sej.v1.json`, {
    declarationType: "semantic-capability.v1",
    capabilityId: id,
    status: "drafted",
    promotionDisposition: "not-evaluated",
    purpose: capability.purpose,
    owns: capability.owns,
    mustNotOwn: capability.mustNotOwn,
    publicOperation: id,
    requiredKernelPrimitives: requiredPrimitives(capability),
    declaredDecision: capability.decisionId,
    declaredResultProjection: `projects-${id}-result`,
    declaredReceiptProjection: `projects-${id}-receipt`,
    declaredDispositions: [capability.successDisposition, capability.failureDisposition],
    dependencies: capability.dependencies,
  });

  writesJson(capabilityRoot, `1-semantic-authority/decisions/${id}.decision.sej.v1.json`, {
    scaffoldType: "semantic-decision-scaffold.v1",
    declarationType: "decision.v1",
    status: "drafted",
    decisionId: capability.decisionId,
    inputs: [],
    rules: [],
    noMatchDisposition: "reject-unresolved-scaffold",
    implicitFallback: "forbidden",
    completionRequirements: [
      "declare-observation-inputs",
      "declare-every-authorized-and-rejected-rule",
      "declare-no-match-disposition",
      "prove-rule-order-and-ambiguity-posture",
    ],
  });

  writesJson(capabilityRoot, `1-semantic-authority/observations/${id}.observation.sej.v1.json`, {
    scaffoldType: "semantic-observation-scaffold.v1",
    declarationType: "semantic-observation.v1",
    status: "drafted",
    observationId: `observes-${id}-facts`,
    inputs: [],
    outputs: [],
    prohibition: "observations-report-facts-and-never-assign-dispositions",
    completionRequirements: [
      "declare-port-supplied-facts",
      "declare-canonical-observation-contract",
      "prove-observer-contains-no-domain-decision",
    ],
  });

  writesJson(capabilityRoot, `1-semantic-authority/policies/${id}.policy.sej.v1.json`, {
    scaffoldType: "semantic-policy-scaffold.v1",
    declarationType: "semantic-policy.v1",
    status: "drafted",
    policyId: `${id}-policy`,
    implicitFallback: "forbidden",
    unclassifiedFailure: "fail-closed",
    successDisposition: capability.successDisposition,
    failureDisposition: capability.failureDisposition,
    idempotencyDisposition: "not-yet-declared",
    replayDisposition: "not-yet-declared",
    completionRequirements: [
      "declare-failure-classifications",
      "declare-idempotency-and-replay",
      "declare-boundary-and-ordering-policy",
    ],
  });

  writesJson(capabilityRoot, `1-semantic-authority/failure-policies/${id}.failure-policy.sej.v1.json`, {
    scaffoldType: "semantic-failure-policy-scaffold.v1",
    declarationType: "semantic-failure-policy.v1",
    status: "drafted",
    failurePolicyId: `${id}-failure-policy`,
    classifications: [],
    unclassifiedFailureDisposition: capability.failureDisposition,
    completionRequirements: [
      "declare-mechanical-failure-observations",
      "declare-semantic-failure-classifications",
      "declare-every-terminal-disposition",
    ],
  });

  writesJson(capabilityRoot, `1-semantic-authority/state-models/${id}.state-model.sej.v1.json`, {
    scaffoldType: "semantic-state-model-scaffold.v1",
    declarationType: "semantic-state-model.v1",
    status: "drafted",
    stateModelId: `${id}-state`,
    states: [
      "requested",
      "authority-resolved",
      "executing",
      "proved",
      "rejected",
      "failed",
    ],
    transitions: [],
    completionRequirements: [
      "declare-authorized-transitions",
      "declare-terminal-state-proof",
      "declare-replay-transition-posture",
    ],
  });

  writesJson(capabilityRoot, `1-semantic-authority/ports/${id}.port.sej.v1.json`, {
    scaffoldType: "semantic-port-catalog-scaffold.v1",
    declarationType: "semantic-port-catalog.v1",
    status: "drafted",
    portCatalogId: `${id}-ports`,
    ports: capability.ports.map((port) => ({
      portId: port.portId,
      effect: port.effect,
      purpose: port.purpose,
      inputContract: `${port.portId}.input.v1`,
      outputContract: `${port.portId}.output.v1`,
      adapterStatus: "not-seated",
    })),
  });

  for (const port of capability.ports) {
    writesJson(capabilityRoot, `contracts/ports/${port.portId}.input.schema.v1.json`, {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: `urn:deterministic-solutions:${id}:port:${port.portId}:input:v1`,
      title: `${port.portId} input`,
      type: "object",
      required: ["portRequestType", "operationId", "authority"],
      properties: {
        portRequestType: { const: `${port.portId}-request.v1` },
        operationId: { type: "string", minLength: 1 },
        authority: { type: "object" },
      },
      additionalProperties: false,
      "x-scaffold-status": "drafted",
    });
    writesJson(capabilityRoot, `contracts/ports/${port.portId}.output.schema.v1.json`, {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: `urn:deterministic-solutions:${id}:port:${port.portId}:output:v1`,
      title: `${port.portId} output`,
      type: "object",
      required: ["portResultType", "operationId", "observation"],
      properties: {
        portResultType: { const: `${port.portId}-result.v1` },
        operationId: { type: "string", minLength: 1 },
        observation: { type: "object" },
        mechanicalFailure: { type: ["object", "null"] },
      },
      additionalProperties: false,
      "x-scaffold-status": "drafted",
    });
  }

  writesJson(capabilityRoot, `1-semantic-authority/effects/${id}.effects.sej.v1.json`, {
    scaffoldType: "semantic-effect-catalog-scaffold.v1",
    declarationType: "semantic-effect-catalog.v1",
    status: "drafted",
    effectCatalogId: `${id}-effects`,
    effects: [...new Set(capability.ports.map((port) => port.effect))].map((effect) => ({
      effect,
      authorization: "must-be-resolved-before-invocation",
      testimony: "required",
    })),
  });

  writesJson(capabilityRoot, `1-semantic-authority/proof-requirements/${id}.proof.requirement.sej.v1.json`, {
    scaffoldType: "semantic-proof-requirement-scaffold.v1",
    declarationType: "semantic-proof-requirement.v1",
    status: "drafted",
    proofRequirementId: `${id}-proof`,
    requiredAssertions: [
      "request-contract-hash-recorded",
      "semantic-authority-hash-recorded",
      "resolved-decision-and-rule-recorded",
      "authorized-operation-testimony-recorded",
      "result-contract-validation-recorded",
      "final-disposition-recorded",
    ],
    negativeControls: [
      "undeclared-edge-is-rejected",
      "invalid-input-contract-is-rejected",
      "mechanical-failure-is-not-silently-reclassified",
    ],
  });

  writesJson(capabilityRoot, `2-semantic-projections/projects-${id}-result.sej.v1.json`, {
    scaffoldType: "semantic-projection-scaffold.v1",
    declarationType: "projection.v1",
    status: "drafted",
    projectionId: `projects-${id}-result`,
    accepts: { contractId: `executed-${id}.v1` },
    produces: { contractId: `${id}-result.v1` },
    expression: null,
    completionRequirements: [
      "declare-every-result-field-mapping",
      "declare-missing-value-policy",
      "declare-canonical-ordering",
      "execute-through-kernel-projection",
    ],
  });

  writesJson(capabilityRoot, `2-semantic-projections/projects-${id}-receipt.sej.v1.json`, {
    scaffoldType: "semantic-projection-scaffold.v1",
    declarationType: "projection.v1",
    status: "drafted",
    projectionId: `projects-${id}-receipt`,
    accepts: { contractId: `executed-${id}.v1` },
    produces: { contractId: `${id}-receipt.v1` },
    expression: null,
    completionRequirements: [
      "declare-receipt-field-mappings",
      "include-required-proof-hashes",
      "include-observed-findings",
      "execute-through-kernel-projection",
    ],
  });

  writesJson(capabilityRoot, `3-semantic-execution-models/${id}.execution.sej.v1.json`, {
    scaffoldType: "semantic-execution-model-scaffold.v1",
    declarationType: "semantic-execution-model.v1",
    status: "drafted",
    executionModelId: `executes-${id}`,
    steps: [
      {
        sequence: 1,
        operation: "invoke",
        semanticIdentity: `resolves-${id}-authority`,
        input: "context",
        binds: "authority",
      },
      {
        sequence: 2,
        operation: "invoke",
        semanticIdentity: `executes-resolved-${id}`,
        input: "authority",
        binds: "execution",
      },
      {
        sequence: 3,
        operation: "project",
        semanticIdentity: `projects-${id}-receipt`,
        input: "execution",
        returns: true,
      },
    ],
    controlFlowAuthority: capability.iterationRequired === true
      ? [`${id}.iteration.sej.v1.json`]
      : [],
    completionRequirements: [
      "bind-resolved-authority-contract",
      "bind-declared-ports",
      "bind-failure-policy",
      "bind-proof-evaluation",
    ],
  });

  const iterationsRoot = path.join(capabilityRoot, "3-semantic-execution-models", "iterations");
  fs.mkdirSync(iterationsRoot, { recursive: true });
  if (capability.iterationRequired === true) {
    writesJson(capabilityRoot, `3-semantic-execution-models/iterations/${id}.iteration.sej.v1.json`, {
      scaffoldType: "semantic-iteration-scaffold.v1",
      declarationType: "iteration.v1",
      status: "drafted",
      iterationId: `iterates-${id}-items`,
      collectionPath: "to-be-declared",
      itemContextPath: "$.item",
      projectionId: "to-be-declared",
      order: "source",
      completionRequirements: [
        "declare-collection-path",
        "declare-ordering-authority",
        "declare-item-operation",
        "declare-stop-and-collection-policy",
      ],
    });
  } else {
    writesText(capabilityRoot, "3-semantic-execution-models/iterations/.gitkeep", "");
  }

  writesJson(capabilityRoot, `projectors/typescript/capability-body.projection.v1.json`, {
    projectionType: "typescript-linear-capability-body-projection.v1",
    status: "drafted",
    capabilityId: id,
    sourceExecutionModel: `../../3-semantic-execution-models/${id}.execution.sej.v1.json`,
    targetBody: `../../runtime/typescript/bodies/${id}.ts`,
    targetContextType: `../../runtime/typescript/types/${id}-context.type.ts`,
    targetRegistration: `../../runtime/typescript/registration/registers-${id}-authority.ts`,
    functionName: camel,
    contextTypeName: `${pascal}Context`,
    generatedBodyPolicy: "resolve-execute-project-return-only",
  });

  writesJson(capabilityRoot, `conformance/${id}.conformance.v1.json`, {
    vectorType: "capability-conformance-vector.v1",
    vectorId: `${id}-scaffolded-flow`,
    capabilityId: id,
    status: "candidate",
    inputFixture: `../proof/fixtures/${id}.candidate.input.json`,
    expectedFixture: `../proof/expectations/${id}.candidate.expected.json`,
    expectedDisposition: capability.successDisposition,
    kernelExecution: "not-evaluated",
    promotionBlockers: [
      "semantic-decision-not-authored",
      "semantic-projections-not-authored",
      "mechanical-adapters-not-seated",
      "live-kernel-proof-not-recorded",
    ],
  });

  writesJson(capabilityRoot, `proof/fixtures/${id}.candidate.input.json`, {
    requestType: `${id}-request.v1`,
    requestId: `${id}-candidate-001`,
    payload: Object.fromEntries(capability.requestFields.map((field) => [field.name, sampleValue(field)])),
  });

  writesJson(capabilityRoot, `proof/expectations/${id}.candidate.expected.json`, {
    scaffoldType: "capability-proof-expectation-scaffold.v1",
    capabilityId: id,
    status: "not-evaluated",
    expectedDisposition: capability.successDisposition,
    requiredProofRequirement: `${id}-proof`,
    note: "Replace with kernel-observed canonical receipt before promotion.",
  });

  writesJson(capabilityRoot, `proof/canonicalization/${id}.canonicalization.v1.json`, {
    scaffoldType: "canonicalization-authority-scaffold.v1",
    canonicalizationId: `${id}-canonicalization`,
    status: "drafted",
    objectKeyOrder: "ordinal",
    collectionOrder: "must-be-declared-by-semantic-authority",
    hashAlgorithm: "sha256",
    excludedFields: [],
    completionRequirements: [
      "declare-all-order-sensitive-collections",
      "prove-root-independent-relative-paths",
      "prove-replay-equivalence",
    ],
  });

  writesText(capabilityRoot, `docs/${id}.md`, rendersCapabilityDocumentation(capability));
  writesText(capabilityRoot, "4-adapters/typescript/.gitkeep", "");
  writesJson(capabilityRoot, "governance/capability-body-policy.json", {
    policyType: "linear-capability-body-policy.v1",
    capabilityId: id,
    status: "drafted",
    sourceOfBody: `3-semantic-execution-models/${id}.execution.sej.v1.json`,
    projectionDescriptor: "projectors/typescript/capability-body.projection.v1.json",
    requiredShape: [
      "resolve-authority",
      "execute-resolved-authority",
      "project-receipt",
      "return",
    ],
    forbiddenSyntax: [
      "IfStatement",
      "SwitchStatement",
      "ForStatement",
      "ForOfStatement",
      "ForInStatement",
      "WhileStatement",
      "DoWhileStatement",
      "ConditionalExpression",
      "TryStatement",
    ],
    handAuthoredBodyChanges: "forbidden",
  });
  writesJson(capabilityRoot, "governance/boundary-policy.json", {
    policyType: "projection-boundary-policy.v1",
    capabilityId: id,
    canonicalRoots: [
      "intent",
      "features",
      "contracts",
      "1-semantic-authority",
      "2-semantic-projections",
      "3-semantic-execution-models",
      "proof",
    ],
    projectedRoots: [
      "projectors",
      "runtime",
      "4-adapters",
    ],
    directEffectsFromCapabilityBody: "forbidden",
    domainMeaningInAdapters: "forbidden",
  });
  writesJson(capabilityRoot, "governance/promotion-policy.json", {
    policyType: "capability-promotion-policy.v1",
    capabilityId: id,
    currentStatus: "drafted",
    requiredGates: [
      "intent",
      "scenario",
      "boundary",
      "semantic",
      "kernel",
      "body",
      "adapter",
      "contract",
      "proof",
      "replay",
      "portability",
      "composition",
      "mutation",
    ],
    promotionRequiresObservedKernelReceipt: true,
    scaffoldMayClaimConformancePassed: false,
  });
}

console.log(`PASS workspace-registry-scaffold (${created.length} created, ${refreshed.length} refreshed, ${unchanged.length} unchanged)`);

function fieldSchema(field) {
  const schemas = {
    string: { type: "string", minLength: 1 },
    integer: { type: "integer", minimum: 1 },
    array: { type: "array", items: {} },
    object: { type: "object" },
  };
  return schemas[field.type];
}

function sampleValue(field) {
  const samples = {
    workspaceRoot: ".",
    workspaceName: "candidate-workspace",
    outputPath: ".sej-query/registry.v1.json",
    persistenceMode: "persist",
    excludedRelativePaths: [".sej-query/registry.v1.json"],
    relativePath: "contracts/candidate.json",
    maximumReadBytes: 1048576,
    documentObservation: {},
    supportedSchemaFamilies: [],
    documents: [],
    workspace: {},
    provenance: {},
    diagnostics: [],
    summary: {},
    registry: {},
    expectedRecordHash: `sha256:${"0".repeat(64)}`,
  };
  return samples[field.name] ?? (field.type === "array" ? [] : field.type === "object" ? {} : field.type === "integer" ? 1 : "candidate");
}

function requiredPrimitives(capability) {
  return [
    "contract.validate.v1",
    "decision.resolve.v1",
    "projection.apply.v1",
    "execution.sequence.v1",
    "testimony.record.v1",
    ...(capability.ports.length > 0 ? ["port.invoke.v1"] : []),
    ...(capability.iterationRequired === true ? ["iteration.execute.v1"] : []),
  ];
}

function rendersCapabilityDocumentation(capability) {
  const dependencies = capability.dependencies.length === 0
    ? "- None. This capability is a family entry boundary."
    : capability.dependencies.map((dependency) => `- \`${dependency}\``).join("\n");
  const ports = capability.ports.length === 0
    ? "- None directly. Composition occurs through published capability contracts."
    : capability.ports.map((port) => `- \`${port.portId}\` — ${port.purpose}`).join("\n");
  return [
    `# ${capability.title}`,
    "",
    "**Posture:** drafted scaffold; not executable and not promoted",
    "",
    `**Owned outcome:** ${capability.purpose}`,
    "",
    "## Projection boundary",
    "",
    "Canonical intent, decisions, policies, contracts, projections, execution models,",
    "ports, effects, and proof requirements remain language-neutral. The TypeScript",
    "capability body is generated from the semantic execution model and may contain",
    "only resolve, execute, project, and return operations.",
    "",
    "## Mechanical ports",
    "",
    ports,
    "",
    "## Published dependencies",
    "",
    dependencies,
    "",
    "## Implementation handoff",
    "",
    "The semantic declarations in this body are deliberate scaffolds. A follow-on",
    "implementation must replace the empty decision rules and projection expressions,",
    "seat mechanical adapters behind the declared ports, execute candidate vectors",
    "through the semantic kernel, and record observed receipts before changing the",
    "capability status from `drafted`.",
    "",
  ].join("\n");
}

function rendersArchitecture(capability) {
  return {
    "system-context.ascii.md": [
      `# ${capability.title} system context`,
      "",
      "```text",
      "Authorized caller",
      "      |",
      "      v",
      `[ ${capability.capabilityId} ]`,
      "      |",
      "      v",
      "External semantic kernel",
      "      |",
      "      v",
      "Declared mechanical ports -> observed testimony -> proof receipt",
      "```",
      "",
    ].join("\n"),
    "capability-boundary.ascii.md": [
      `# ${capability.title} boundary`,
      "",
      "```text",
      "OWNS",
      ...capability.owns.map((item) => `  + ${item}`),
      "",
      "MUST NOT OWN",
      ...capability.mustNotOwn.map((item) => `  - ${item}`),
      "```",
      "",
    ].join("\n"),
    "semantic-execution-flow.ascii.md": [
      `# ${capability.title} semantic execution`,
      "",
      "```text",
      "Contract-valid request",
      "        |",
      "        v",
      `Resolve ${capability.decisionId}`,
      "        |",
      "        v",
      "Immutable resolved authority",
      "        |",
      "        v",
      "Execute declared operations through kernel and ports",
      "        |",
      "        v",
      `Project ${capability.capabilityId} receipt`,
      "```",
      "",
    ].join("\n"),
    "proof-flow.ascii.md": [
      `# ${capability.title} proof flow`,
      "",
      "```text",
      "Declared authority hash",
      "          +",
      "Observed operation testimony",
      "          +",
      "Contract validation findings",
      "          |",
      "          v",
      `${capability.capabilityId} proof evaluation`,
      "          |",
      "          v",
      `Receipt: ${capability.successDisposition} or ${capability.failureDisposition}`,
      "```",
      "",
    ].join("\n"),
  };
}

function writesJson(capabilityRoot, relativePath, value) {
  writesFile(capabilityRoot, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writesText(capabilityRoot, relativePath, value) {
  writesFile(capabilityRoot, relativePath, value);
}

function writesFile(capabilityRoot, relativePath, content) {
  const target = path.join(capabilityRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(target)) {
    const existing = fs.readFileSync(target, "utf8");
    if (existing !== content) {
      const authorityPath = path.join(capabilityRoot, "1-semantic-authority", `${path.basename(capabilityRoot)}.capability.sej.v1.json`);
      const authorityIsDrafted = !fs.existsSync(authorityPath)
        || JSON.parse(fs.readFileSync(authorityPath, "utf8")).status === "drafted";
      if (!refresh || !authorityIsDrafted) {
        throw new Error(`Refusing to overwrite non-matching scaffold artifact: ${path.relative(root, target)}`);
      }
      fs.writeFileSync(target, content, "utf8");
      refreshed.push(target);
      return;
    }
    unchanged.push(target);
    return;
  }
  fs.writeFileSync(target, content, "utf8");
  created.push(target);
}
