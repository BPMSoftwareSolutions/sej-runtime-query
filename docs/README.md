# Capability Catalog

| # | Capability | Owned outcome | Posture |
|---:|---|---|---|
| — | `parses-query-command` | Produce one canonical query command from submitted query text. | drafted |
| — | `resolves-query-source` | Resolve one authorized source for a canonical query command. | drafted |
| — | `selects-query-facts` | Select only the declared facts from resolved source rows. | drafted |
| — | `filters-query-rows` | Apply declared predicates to resolved source rows. | drafted |
| — | `indexes-workspace-authority` | Produce an inspectable index of semantic authority in a workspace. | drafted |
| 01 | `resolves-query-selected-authority` | Resolve executable semantic authority selected by a query. | drafted |
| 02 | `applies-semantic-projection` | Apply one resolved semantic projection to a canonical query result. | implemented |
| 03 | `constructs-semantic-execution-context` | Construct one immutable context from query-selected facts and authority. | drafted |
| 04 | `resolves-authority-by-metadata` | Resolve semantic authority using declared metadata selectors. | drafted |
| 05 | `executes-selected-semantic-subgraph` | Execute only the semantic subgraph authorized by the query. | drafted |
| 06 | `explains-semantic-execution` | Project an explainable plan for selected semantic execution. | drafted |
| 07 | `composes-semantic-authority` | Compose compatible semantic authorities under declared composition policy. | drafted |
| 08 | `applies-semantic-policy-overlay` | Apply an explicit policy overlay without mutating source authority. | drafted |
| 09 | `joins-semantic-authority` | Join authority facts across declared semantic sources. | drafted |
| 10 | `resolves-kernel-compatibility` | Determine whether selected authority is executable by the seated semantic kernel. | drafted |
| 11 | `chains-semantic-results` | Pass canonical semantic results through an authorized dataflow. | drafted |
| 12 | `derives-conformance-vector-candidates` | Derive candidate conformance vectors from selected semantic authority. | drafted |
| 13 | `lints-semantic-authority` | Produce executable lint findings for selected semantic authority. | drafted |
| 14 | `projects-semantic-proof` | Project canonical proof from declared and observed semantic execution facts. | drafted |
| 15 | `routes-semantic-command` | Route a canonical command to one declared command-family capability. | drafted |
| — | `projects-each-query-row` | Project each selected row independently under declared row scope. | drafted |
| — | `projects-complete-query-result` | Project a complete canonical query result as one semantic object. | drafted |
| — | `renders-canonical-query-result` | Render canonical semantic content into a declared physical representation. | drafted |
| — | `verifies-conformance-vector` | Verify one conformance vector against selected semantic authority and observed result. | drafted |
| — | `projects-language-delegation-shell` | Project a language-specific delegation shell below the projection boundary. | drafted |

The numbered 01–15 entries are the dynamic semantic query capabilities. Foundational lifecycle and projection-support capabilities use the same micro-capability body and remain separately governable.

Integrating the semantic kernel into your SEJ Query Engine changes it from a system that can **inspect, verify, resolve, and project specifications** into a system that can also **dynamically interpret and compose semantic authority at query time**.

Right now, the engine already has three strong modes:

```text
SELECT  → inspect declared truth
RESOLVE → execute one semantic responsibility
VERIFY  → compare runtime behavior with conformance vectors
PROJECT → generate language-specific delegation shells
```

It also already understands the core SEJ surfaces: `typeRegistry`, `projectionContracts`, `semanticBody`, `codeProjection`, `conformanceVectors`, and `workspaceProjection`. 

The semantic kernel adds a new layer:

```text
Query
  ↓
Discover semantic authority
  ↓
Resolve applicable declarations
  ↓
Compose executable authority
  ↓
Execute generic primitives
  ↓
Project result or new authority
  ↓
Produce proof
```

# 1. Queries become executable semantic selectors

Today, a query such as:

```sql
SELECT semanticBody.graph.graph.steps
FROM code-projection-sej
```

returns declarations for inspection.

With kernel integration, selected declarations can become directly executable:

```sql
RESOLVE DECISION resolve-resource-classification
FROM code-projection-sej
USING {
  "measurement": 900,
  "threshold": 500
}
```

Conceptually, the engine would:

```text
Locate decision authority
      ↓
Load required predicates
      ↓
Validate input context
      ↓
Evaluate rules
      ↓
Return selected rule and disposition
```

That creates a dynamic semantic resolution surface—not just a wrapper around one predefined top-level responsibility.

## Emerging capability

```text
Any queryable decision
        becomes
an independently executable decision endpoint
```

You could resolve:

* One decision
* One projection
* One iteration model
* One state transition
* One failure policy
* One proof requirement
* One subgraph within a larger responsibility

---

# 2. Projection contracts become queryable transformation functions

The engine already exposes declared DTO mappings through `projectionContracts`, and the README emphasizes that request and result mappings are explicit rather than implicit. 

With a semantic projector inside the query engine, you could execute them dynamically:

```sql
PROJECT VALUE
USING projection-contract project-input-to-resource-request
FROM code-projection-sej
WITH {
  "memoryUsage": 499
}
```

Result:

```json
{
  "measurement": 499
}
```

This means every projection contract becomes a reusable transformation primitive.

## New dynamic projection capabilities

You could:

* Project selected fields into a new DTO.
* Project one SEJ contract into another.
* Project query results into reports.
* Project workspace inventory into migration candidates.
* Project execution traces into receipts.
* Project semantic graphs into visualization models.
* Project one specification version into a compatibility shape.

The important shift is:

```text
Projection contracts stop being
code-generation metadata only.

They become live data transformation authority.
```

---

# 3. Queries can dynamically construct execution contexts

At present, SQL-like queries select values from corpus documents.

After integration, the result of one query could become the input context for another semantic operation.

For example:

```text
Query type definitions
        ↓
Query applicable projection
        ↓
Query responsibility metadata
        ↓
Build execution context
        ↓
Resolve responsibility
```

Conceptually:

```sql
WITH selected_contract AS (
  SELECT projectionContracts
  FROM code-projection-sej
  WHERE projectionId = project-resource-request
),
selected_body AS (
  SELECT semanticBody.graph
  FROM code-projection-sej
  WHERE responsibilityId = the-resource-classification-is-resolved
)
RESOLVE selected_body
USING PROJECT selected_contract
FROM {
  "memoryUsage": 900
}
```

You do not necessarily need SQL syntax this complex in v1, but architecturally this becomes possible.

## Emerging capability

```text
Query results become semantic inputs.

Semantic results become queryable rows.

Rows become inputs to further resolution.
```

That creates a genuine semantic pipeline.

---

# 4. The query engine can resolve authority by metadata rather than hard-coded IDs

Your workspace scanner already classifies documents as:

* `sej`
* `dependency-candidate`
* `migration-candidate`
* `authority-candidate`

and treats those classifications as evidence rather than forced guesses. 

The kernel could use queries to locate applicable authority dynamically:

```sql
SELECT relativePath, semanticVersion, candidateRoles
FROM .sej-query/registry.v1.json
WHERE sejClassification = sej
AND supportedPrimitives contains decision.resolve.v1
```

Then the resolver could select authority based on:

* Capability ID
* Scenario ID
* Responsibility ID
* Contract version
* Required primitive
* Language profile
* Proof requirement
* Workspace posture
* Compatibility constraints

## Dynamic authority resolution

```text
Request requirements
        +
Workspace registry
        +
Kernel compatibility
        ↓
Applicable semantic authority
```

This becomes the foundation of a capability registry without requiring a separate centralized database immediately.

---

# 5. Subgraphs become independently resolvable units

The current engine executes semantic specifications through the live runtime resolver and can run a named conformance vector using `RESOLVE`. 

A kernel-aware query layer could expose semantic graph fragments:

```sql
SELECT steps
FROM semanticBody.graph
WHERE operationKind = decision
AND responsibilityId = the-resource-classification-is-resolved
```

Then execute only the selected fragment.

This allows:

```text
Full responsibility resolution
Decision-only resolution
Projection-only execution
Iteration-only execution
Failure-classification resolution
Proof-only evaluation
```

That is powerful for design-time debugging.

Instead of asking:

> Why did the whole responsibility produce `HIGH_MEMORY`?

You could ask:

```text
Which predicate matched?
Which rule won?
Which inputs were read?
Which projection followed?
Which operation was skipped?
```

The query engine becomes a semantic debugger.

---

# 6. Dynamic explain plans emerge

A SQL engine normally produces an execution plan.

Your integrated SEJ engine could produce a **semantic explain plan**:

```sql
EXPLAIN RESOLVE code-projection-sej
USING VECTOR above-threshold
```

Possible result:

```text
Responsibility:
  the-resource-classification-is-resolved

Input contract:
  resource-usage-request.v1

Operations:
  1. read measurement
  2. read threshold
  3. evaluate greater-than-or-equal
  4. resolve resource classification
  5. project classification result
  6. return result

Selected rule:
  measurement-greater-than-or-equal-threshold

Expected disposition:
  HIGH_MEMORY

Required primitives:
  path.read.v1
  predicate.greater-than-or-equal.v1
  decision.resolve.v1
  projection.apply.v1
```

## New capability

You can inspect not only what the authority contains, but:

```text
What will execute
Why it will execute
Which primitives it requires
Which effects it may invoke
What evidence it must produce
```

That is a major leap in semantic introspection.

---

# 7. Query-driven composition of semantic authorities

The engine can dynamically combine selected declarations into a resolved authority pack.

For example:

```text
Decision catalog
      +
Projection contract
      +
Iteration model
      +
Port declaration
      +
Proof contract
      ↓
Resolved capability authority
```

A query might select:

```sql
SELECT
  semanticBody.graph,
  projectionContracts,
  codeProjection.executionBodyProfiles,
  workspaceProjection.executable
FROM code-projection-sej
WHERE responsibilityId = the-resource-classification-is-resolved
```

The kernel can validate that those pieces correlate and produce a sealed executable bundle.

## Emerging capability

```text
A capability does not need to be loaded
as one monolithic JSON document.

It can be assembled from independently
queryable semantic authorities.
```

That enables:

* Authority overlays
* Policy replacement
* Environment-specific authority
* Version-specific projections
* Client-owned output contracts
* Test-only proof requirements
* Provider-specific semantic packs

---

# 8. Dynamic policy overlays

Suppose the base semantic authority declares:

```text
measurement >= threshold → HIGH_MEMORY
```

A client overlay may change the threshold source or result projection without replacing the core responsibility.

The query engine could resolve:

```text
Base semantic body
        +
Client projection
        +
Environment policy
        +
Execution constraints
        ↓
Resolved authority
```

For example:

```sql
RESOLVE AUTHORITY
FROM code-projection-sej
WITH OVERLAY production-resource-policy
WITH PROJECTION client-code-projection
```

This creates controlled variability:

```text
Stable canonical responsibility
        +
Declared client authority
        =
Context-specific executable behavior
```

Crucially, this is not ad hoc runtime configuration. Every overlay remains queryable, hashable, and provable.

---

# 9. Dynamic cross-specification joins

Your future work already identifies multi-file corpus querying as a likely direction. 

With the semantic kernel, joins become more than analysis.

You could correlate:

```text
Capability specification
    JOIN
Port catalog
    JOIN
Projection registry
    JOIN
Language profile
    JOIN
Proof contract
```

Example conceptual query:

```sql
SELECT
  capability.responsibilityId,
  ports.portId,
  projections.projectionId,
  profiles.language
FROM capability-sej capability
JOIN port-catalog-sej ports
  ON capability.requiredPortIds contains ports.portId
JOIN projection-catalog-sej projections
  ON capability.requiredProjectionIds contains projections.projectionId
JOIN language-profiles-sej profiles
  ON profiles.supportedPrimitives contains capability.requiredPrimitives
```

The result could then be resolved into:

```text
A complete executable capability composition
```

This is where the query engine begins acting as a semantic linkage engine.

---

# 10. Queryable kernel compatibility resolution

Each semantic authority can declare required primitives:

```json
{
  "requiredPrimitives": [
    "predicate.greater-than-or-equal.v1",
    "decision.resolve.v1",
    "projection.apply.v1"
  ]
}
```

The workspace registry can expose kernel implementations and supported primitives.

Then:

```sql
SELECT implementationId
FROM kernel-registry
WHERE supportedPrimitives contains-all requiredPrimitives
AND specificationVersion satisfies "^1.0.0"
```

## Emerging capability

The engine can dynamically answer:

```text
Which kernel can execute this authority?

Which language implementation conforms?

Which primitive is missing?

Can this specification run here?

Can it be projected but not executed?

Can it execute but not prove?
```

That becomes runtime and build-time capability negotiation.

---

# 11. Semantic result chaining

Once resolver outputs are canonical JSON, they become queryable immediately.

```text
Resolve responsibility
       ↓
Query result
       ↓
Select specific facts
       ↓
Project into next request
       ↓
Resolve next responsibility
```

For example:

```text
Repository scan result
       ↓
SELECT authority candidates
       ↓
Project candidate review requests
       ↓
Resolve candidate disposition
       ↓
SELECT admitted candidates
       ↓
Project workspace shaping plan
```

This gives you a data-driven orchestration model without embedding orchestration logic in code.

```text
Query
  → resolve
  → query
  → project
  → resolve
  → prove
```

That is essentially an executable semantic dataflow language.

---

# 12. Dynamic conformance-vector generation

Today, `VERIFY` executes declared conformance vectors through the resolver. 

With kernel-backed projections, the engine could generate or derive vectors from semantic structure:

```text
Decision rules
      ↓
Boundary inputs
      ↓
Projected vector candidates
      ↓
Resolver execution
      ↓
Coverage report
```

For the threshold example:

```text
Rule: measurement < threshold
Rule: measurement >= threshold
```

The engine could derive:

```text
threshold - 1
threshold
threshold + 1
```

Then execute those as candidate vectors.

This would enable:

* Rule coverage analysis
* Predicate boundary generation
* Missing-case detection
* Ambiguity detection
* Dead-rule detection
* Mutation vector generation

Generated vectors should remain candidates until admitted, but the kernel makes their execution immediate.

---

# 13. Dynamic semantic linting through executable queries

The engine could query for structural problems and then run the relevant semantic primitive to verify them.

Examples:

```sql
SELECT decisionId
FROM decisions
WHERE rules exists
AND defaultDisposition absent
```

```sql
SELECT projectionId
FROM projectionContracts
WHERE targetContract absent
```

```sql
SELECT responsibilityId
FROM semanticBody
WHERE requiredPrimitives not-supported-by activeKernel
```

```sql
SELECT operationId
FROM executionModels
WHERE invokedPortId not-in declaredPorts
```

Then kernel-backed validation can classify each finding.

The query engine becomes both:

```text
Structural analyzer
        +
Executable conformance evaluator
```

---

# 14. Dynamic proof projection

Because every operation is selected through queryable authority, the engine can automatically project proof records.

A resolution command could emit:

```json
{
  "queryHash": "sha256:...",
  "sourceDocumentHashes": [],
  "semanticAuthorityHash": "sha256:...",
  "kernelImplementation": "sej-semantic-kernel-node",
  "selectedDecisionRuleIds": [],
  "appliedProjectionIds": [],
  "executedOperationIds": [],
  "invokedPortIds": [],
  "inputHash": "sha256:...",
  "resultHash": "sha256:...",
  "disposition": "RESOLUTION_PROVEN"
}
```

This gives you traceability from:

```text
Query text
    ↓
Selected authority
    ↓
Resolved execution
    ↓
Projected output
    ↓
Proof receipt
```

The query itself becomes part of the execution authority and evidence chain.

---

# 15. A new command family could emerge

Your current command grammar is:

```text
SELECT
VERIFY
RESOLVE
PROJECT
```

Kernel integration could naturally expand it to:

```text
EXPLAIN
EVALUATE
APPLY
COMPOSE
TRACE
PROVE
REPLAY
DIFF
```

For example:

```bash
q "EVALUATE decision resolve-resource-classification FROM code-projection-sej USING vector above-threshold"
```

```bash
q "APPLY projection project-resource-request FROM code-projection-sej USING ./input.json"
```

```bash
q "EXPLAIN responsibility the-resource-classification-is-resolved FROM code-projection-sej"
```

```bash
q "TRACE RESOLVE code-projection-sej above-threshold"
```

```bash
q "COMPOSE AUTHORITY FROM code-projection-sej FOR responsibility the-resource-classification-is-resolved"
```

```bash
q "DIFF RESOLUTION code-projection-sej USING vectors below-threshold,above-threshold"
```

```bash
q "PROVE code-projection-sej USING vector at-threshold"
```

---

# The biggest architectural emergence

The most important result is that the SEJ Query Engine becomes a **live semantic control plane**.

Today:

```text
SEJ Query Engine
    =
inspect specifications
+
run known resolver/projector operations
```

After kernel integration:

```text
SEJ Query Engine
    =
discover authority
+
select authority
+
compose authority
+
interpret authority
+
project contracts
+
execute subgraphs
+
trace decisions
+
evaluate proof
+
chain semantic outcomes
```

The architecture becomes:

```text
Workspace corpus
      ↓
Queryable semantic registry
      ↓
Dynamic authority selection
      ↓
Semantic kernel interpretation
      ↓
Canonical resolution or projection
      ↓
Queryable testimony
      ↓
Further semantic composition
```

# The practical north-star demonstration

A powerful first integration would let you do this:

```bash
q "EXPLAIN RESOLVE code-projection-sej above-threshold"
```

And receive:

```text
Source:
  code-projection-sej.valid.v1.json

Responsibility:
  the-resource-classification-is-resolved

Authority:
  semanticBody.graph

Input:
  measurement = 900
  threshold = 500

Decision:
  resolve-resource-classification

Selected rule:
  measurement-greater-than-or-equal-threshold

Projection:
  project-resource-classification-result

Result:
  HIGH_MEMORY

Kernel primitives:
  path.read.v1
  predicate.greater-than-or-equal.v1
  decision.resolve.v1
  projection.apply.v1

Proof:
  RESOLUTION_PROVEN
```

Then:

```bash
q "SELECT selectedRuleIds, appliedProjectionIds, resultHash FROM last-resolution"
```

That closes the loop beautifully:

```text
Query the meaning
      ↓
Execute the meaning
      ↓
Query what happened
```

Your SEJ engine would no longer merely help people understand semantic authority.

It would become the environment in which semantic authority is **discovered, resolved, projected, composed, executed, inspected, and proven dynamically**.

###############################

Yes — and I would make that a **separate semantic phase after query execution**, not another responsibility buried inside `SELECT`.

Your current executor already performs a basic structural projection by selecting fields, while SEJ already contains explicit `projectionContracts` for typed DTO transformations. The engine also calls the resolver and projector packages in-process, so the architectural pieces are already present. 

# The new query lifecycle

```text
Parse query
    ↓
Resolve source
    ↓
Filter rows
    ↓
Select raw fields
    ↓
Resolve result projection authority
    ↓
Project each row or complete result set
    ↓
Validate projected contract
    ↓
Render or return result
    ↓
Produce projection receipt
```

The critical separation is:

```text
SELECT
    owns retrieval shape

Projection authority
    owns semantic output shape

Renderer
    owns physical presentation format
```

So JSON, tables, CSV, Markdown, diagrams, and canonical contracts do not become mixed together.

---

# Three distinct projection levels

I would support three projection scopes.

## 1. Row projection

Transform every selected row independently.

```bash
q "SELECT * FROM .sej-query/registry.v1.json
   WHERE sejClassification = sej
   APPLY PROJECTION project-registry-entry-to-capability-summary"
```

Input row:

```json
{
  "relativePath": "capabilities/file-system-shaper.json",
  "sejClassification": "sej",
  "semanticExecutableJsonVersion": "1.0.0",
  "candidateRoles": []
}
```

Projected row:

```json
{
  "capabilityPath": "capabilities/file-system-shaper.json",
  "classification": "SEJ",
  "specificationVersion": "1.0.0"
}
```

This is essentially:

```text
Query row
    ↓
Declared DTO projection
    ↓
Canonical row contract
```

---

## 2. Result-set projection

Transform the complete query outcome as one semantic object.

```bash
q "SELECT relativePath, sejClassification
   FROM .sej-query/registry.v1.json
   APPLY RESULT PROJECTION project-workspace-capability-report"
```

Input:

```json
{
  "columns": [
    "relativePath",
    "sejClassification"
  ],
  "rows": [
    {
      "relativePath": "a.json",
      "sejClassification": "sej"
    },
    {
      "relativePath": "b.json",
      "sejClassification": "non-sej"
    }
  ]
}
```

Output:

```json
{
  "reportType": "workspace-capability-report.v1",
  "capabilityCount": 1,
  "otherDocumentCount": 1,
  "capabilities": [
    {
      "path": "a.json"
    }
  ]
}
```

This scope enables:

* Reports
* Dashboards
* Coverage summaries
* Dependency manifests
* Migration plans
* Authority inventories
* Proof packages

---

## 3. Presentation projection

Convert a canonical result into a physical output representation.

```bash
q "SELECT relativePath, candidateRoles
   FROM .sej-query/registry.v1.json
   WHERE candidateRoles contains authority-candidate
   APPLY RESULT PROJECTION project-authority-candidate-report
   FORMAT markdown"
```

The projection produces semantic content:

```json
{
  "title": "Authority Candidates",
  "items": [
    {
      "path": "legacy-policy.json",
      "roles": [
        "authority-candidate"
      ]
    }
  ]
}
```

The renderer produces Markdown:

```markdown
# Authority Candidates

- `legacy-policy.json`
  - authority-candidate
```

That separation matters:

```text
Semantic projection:
What the report means.

Renderer:
How the report is physically represented.
```

The README already identifies CSV/table output and query-result visualization as future enhancements. A semantic result projection layer gives all of those formats one canonical source rather than separate ad hoc formatter logic. 

---

# Projection configuration contract

I would introduce a query-result projection authority like this:

```json
{
  "projectionAuthorityType": "query-result-projection.v1",
  "projectionId": "project-registry-entry-to-capability-summary",
  "scope": "each-row",
  "accepts": {
    "contractId": "workspace-registry-document-entry.v1"
  },
  "produces": {
    "contractId": "capability-summary.v1"
  },
  "fields": {
    "capabilityPath": "$.relativePath",
    "classification": {
      "operation": "map-value",
      "source": "$.sejClassification",
      "mapping": {
        "sej": "SEJ",
        "non-sej": "OTHER"
      }
    },
    "specificationVersion": "$.semanticExecutableJsonVersion"
  },
  "missingValuePolicy": "reject-row",
  "additionalFieldPolicy": "discard",
  "validationPolicy": {
    "validateInput": true,
    "validateOutput": true
  }
}
```

This should use the same projection vocabulary as the semantic kernel wherever possible:

```text
read-path
constant
copy
write-path
map-value
collect
merge
calculate
```

Do not invent a second unrelated mapping language for query results.

---

# Query syntax

I would avoid overloading the existing `PROJECT` command because it currently means **generate language-specific code from an SEJ specification**. 

A clearer syntax is:

```sql
SELECT ...
FROM ...
WHERE ...
APPLY PROJECTION <projection-id>
LIMIT ...
```

For full result sets:

```sql
SELECT ...
FROM ...
APPLY RESULT PROJECTION <projection-id>
```

For an external authority file:

```sql
SELECT ...
FROM ...
APPLY PROJECTION FILE "./projections/project-capability-summary.sej.json"
```

For a projection contained inside the queried source:

```sql
SELECT ...
FROM code-projection-sej
APPLY PROJECTION project-query-result-summary
USING AUTHORITY code-projection-sej
```

For inline development experiments, possibly:

```sql
SELECT relativePath, sejClassification
FROM registry
INTO {
  "path": "$.relativePath",
  "kind": "$.sejClassification"
}
```

But I would treat inline projection as a **draft convenience**, not canonical authority. Production projections should have stable IDs, schemas, hashes, tests, and receipts.

---

# Configurable projection registry

The engine should resolve projections from an explicit registry.

```text
.sej-query/
├── registry.v1.json
├── projections/
│   ├── project-capability-summary.sej.v1.json
│   ├── project-authority-candidate-report.sej.v1.json
│   └── project-dependency-graph.sej.v1.json
└── projection-registry.v1.json
```

Example registry:

```json
{
  "registryType": "query-result-projection-registry.v1",
  "projections": [
    {
      "projectionId": "project-capability-summary",
      "authorityPath": "projections/project-capability-summary.sej.v1.json",
      "scope": "each-row",
      "inputContractId": "workspace-registry-document-entry.v1",
      "outputContractId": "capability-summary.v1",
      "status": "accepted"
    }
  ]
}
```

Resolution should be deterministic:

```text
Explicit projection file
        ↓ otherwise
Workspace projection registry
        ↓ otherwise
Source-owned projection authority
        ↓ otherwise
Fail: projection not found
```

No implicit fallback to a similarly named projection.

---

# Query-result envelope

Do not send an anonymous array directly into the projector.

Create a canonical query result contract:

```json
{
  "queryResultType": "sej-query-result.v1",
  "query": {
    "normalizedText": "SELECT relativePath FROM registry",
    "queryHash": "sha256:..."
  },
  "source": {
    "sourceId": "workspace-registry",
    "sourceHash": "sha256:..."
  },
  "selection": {
    "columns": [
      {
        "name": "relativePath",
        "sourcePath": "$.relativePath"
      }
    ]
  },
  "rows": [],
  "rowCount": 0,
  "execution": {
    "whereApplied": true,
    "limitApplied": null
  }
}
```

That gives result-set projections a stable and inspectable input.

For row projection, each invocation should receive:

```json
{
  "rowIndex": 0,
  "row": {},
  "queryContext": {},
  "projectionContext": {}
}
```

This allows projections to include row identity or query metadata without hidden access to global state.

---

# The semantic execution shape

The runtime operation can stay collapsed:

```typescript
export async function projectsQueryResult(
  context: ProjectQueryResultContext
): Promise<ProjectedQueryResult> {
  const authority = await edges.invokes(
    "resolve-query-result-projection-authority",
    context
  );

  const execution = await edges.invokes(
    "execute-resolved-query-result-projection",
    authority
  );

  return edges.projects(
    "project-query-result-projection-receipt",
    execution
  );
}
```

Internally, the semantic authority owns:

* Projection scope
* Input contract
* Output contract
* Field mappings
* Collection handling
* Missing-value policy
* Invalid-row policy
* Ordering
* Aggregation
* Output validation
* Proof requirements

This aligns with the four-layer rule that DTO construction belongs in semantic projections rather than authored execution bodies. 

---

# Important policies

## Missing value policy

```text
reject-query
reject-row
omit-field
write-null
use-declared-default
```

No silent defaulting.

## Invalid row policy

```text
stop-on-first-invalid-row
collect-invalid-rows
exclude-invalid-rows
preserve-with-diagnostic
```

The selected policy must appear in authority and receipts.

## Cardinality policy

```text
one-input-to-one-output
one-input-to-many-outputs
many-inputs-to-one-output
many-inputs-to-many-outputs
```

This makes projection behavior explicit.

## Additional field policy

```text
reject
discard
preserve
```

## Ordering policy

```text
preserve-query-order
sort-by-declared-field
group-by-declared-key
```

---

# What this enables immediately

Once this layer exists, the query engine can produce far more than raw selected JSON.

## Capability summaries

```bash
q "SELECT *
   FROM .sej-query/registry.v1.json
   WHERE sejClassification = sej
   APPLY PROJECTION project-capability-summary"
```

## Authority candidate review packets

```bash
q "SELECT *
   FROM .sej-query/registry.v1.json
   WHERE candidateRoles contains authority-candidate
   APPLY RESULT PROJECTION project-authority-review-packet"
```

## Dependency graphs

```bash
q "SELECT codeProjection.dependencyAuthorities
   FROM code-projection-sej
   APPLY RESULT PROJECTION project-dependency-graph"
```

## Conformance coverage reports

```bash
q "SELECT semanticBody.graph, conformanceVectors
   FROM code-projection-sej
   APPLY RESULT PROJECTION project-conformance-coverage-report"
```

## Execution timelines

```bash
q "SELECT operations
   FROM last-resolution
   APPLY RESULT PROJECTION project-execution-timeline"
```

## C4 or ASCII diagram bodies

```bash
q "SELECT semanticBody.graph
   FROM code-projection-sej
   APPLY RESULT PROJECTION project-semantic-graph-diagram"
```

## Input to another capability

```bash
q "SELECT relativePath
   FROM registry
   WHERE candidateRoles contains migration-candidate
   APPLY RESULT PROJECTION project-migration-work-order"
```

This is where query results become composable capability inputs.

---

# Proof receipt

Every configurable projection should emit testimony like:

```json
{
  "receiptType": "query-result-projection-receipt.v1",
  "runId": "run-...",
  "queryHash": "sha256:...",
  "sourceHashes": [
    "sha256:..."
  ],
  "projectionId": "project-capability-summary",
  "projectionAuthorityHash": "sha256:...",
  "projectionScope": "each-row",
  "inputRowCount": 12,
  "projectedRowCount": 12,
  "rejectedRowCount": 0,
  "inputContractId": "workspace-registry-document-entry.v1",
  "outputContractId": "capability-summary.v1",
  "resultHash": "sha256:...",
  "findings": [],
  "disposition": "QUERY_RESULT_PROJECTED"
}
```

This lets you prove:

```text
Which query ran
Which sources it read
Which projection governed the output
Which rows were accepted or rejected
Which contract was produced
What canonical result emerged
```

---

# Recommended first slice

Keep the first implementation tight:

```text
1. Canonical query-result envelope
2. Projection registry
3. APPLY PROJECTION parser support
4. Row-scoped projection
5. Result-set-scoped projection
6. Input and output contract validation
7. Missing-value policies
8. Canonical projection receipt
```

Use three proof scenarios:

```text
Scenario 1:
Project registry rows into capability summaries.

Scenario 2:
Aggregate projected rows into a workspace report.

Scenario 3:
Reject a projection whose required source path is absent.
```

Then prove the killer capability:

```text
Same query result
      +
Projection A
      =
Capability summary

Same query result
      +
Projection B
      =
Migration work order

Same query result
      +
Projection C
      =
Dependency graph
```

No query executor changes between those outcomes.

That gives the engine the exact property you are after:

> **Queries determine which facts are selected. Configurable semantic projections determine what those facts become.**
