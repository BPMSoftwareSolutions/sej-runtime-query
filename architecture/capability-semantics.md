# Capability semantics

This document records the declared behavioral meaning of every capability in the
system. Before this document existed, twenty-four capabilities carried
structurally valid but behaviorally empty scaffolding: identical boilerplate
intent, a shared three-rule authority template, and opaque `payload` / `value`
contracts. Those capabilities could not be promoted because nothing declared
what they were supposed to decide.

Each capability below declares:

- the canonical input it accepts,
- the decision it owns,
- the projection it produces,
- and the disposition vocabulary its receipt may report.

Semantics are expressed against the kernel primitive set only:
`decision.v1`, `projection.v1`, `iteration.v1`, `execution-model.v1`, and
`port.invoke`. No capability owns control flow, fallbacks, or retries.

## Shared canonical shapes

Every capability accepts a request of the form:

```text
{ requestType, requestId, payload }
```

and produces a result of the form:

```text
{ resultType, capabilityId, value }
```

and a receipt of the form:

```text
{ receiptType, runId, capabilityId, authorityHash, inputHash,
  resultHash, disposition, findings }
```

`disposition` is drawn from a per-capability closed vocabulary. `findings` is
empty exactly when the disposition is the capability's success disposition.
A capability fails closed: an input that satisfies no declared rule is rejected
rather than defaulted.

## Query pipeline capabilities

### parses-query-command

Normalizes submitted query text into a canonical query command. Owns the
decision of which command family the text belongs to, based on declared
leading-keyword predicates.

- Decision `resolves-query-command-family` maps normalized text to
  `select-command`, `describe-command`, `explain-command`, or rejection.
- Projection emits `{ commandFamily, normalizedText, sourceRef, projectionRef,
  hasWhere, hasLimit }`.
- Dispositions: `QUERY_COMMAND_PARSED`, `QUERY_COMMAND_UNPARSABLE`.

### resolves-query-source

Selects one authorized source for a parsed command. Resolution is ordered and
explicit: an explicitly named source wins over the workspace default, which
wins over rejection.

- Decision `resolves-query-source-selection` yields
  `use-explicit-source`, `use-workspace-default-source`, or
  `reject-unresolvable-source`.
- Projection emits `{ sourceId, sourceKind, resolutionRule, sourceHash }`.
- Dispositions: `QUERY_SOURCE_RESOLVED`, `QUERY_SOURCE_UNRESOLVED`.

### selects-query-facts

Reduces resolved source rows to exactly the declared column set. Star selection
and explicit column selection are distinct declared rules; an unknown column is
rejected rather than silently dropped.

- Decision `resolves-fact-selection-mode` yields `select-all-declared-facts`
  or `select-named-facts`.
- Iteration `selects-query-fact-rows` maps each row through the selection
  projection.
- Dispositions: `QUERY_FACTS_SELECTED`, `QUERY_FACT_UNKNOWN_COLUMN`.

### filters-query-rows

Applies one declared kernel predicate to resolved rows. The capability owns
predicate *selection and application*, never predicate implementation, which
belongs to the kernel evaluator.

- Decision `resolves-row-filter-mode` yields `apply-declared-predicate` or
  `pass-through-unfiltered`.
- Projection emits `{ rows, inputRowCount, retainedRowCount,
  rejectedRowCount }` using kernel `filter` and `count` expressions.
- Dispositions: `QUERY_ROWS_FILTERED`, `QUERY_FILTER_PREDICATE_INVALID`.

### projects-each-query-row

Row-scoped projection execution. Distinct from `applies-semantic-projection`,
which owns authority resolution and scope dispatch; this capability owns only
the per-row iteration contract and its ordering guarantee.

- Decision `resolves-row-projection-order` yields `source` or `reverse`.
- Iteration `projects-each-row` executes the resolved row projection.
- Dispositions: `QUERY_ROWS_PROJECTED`, `QUERY_ROW_PROJECTION_REJECTED`.

### projects-complete-query-result

Result-set-scoped projection execution. Owns the single-shot whole-result
projection and its cardinality guarantee of exactly one output.

- Decision `resolves-complete-result-disposition` yields
  `project-complete-result` or `reject-empty-required-result`.
- Dispositions: `QUERY_RESULT_PROJECTED`, `QUERY_RESULT_PROJECTION_REJECTED`.

### renders-canonical-query-result

Renders a projected result into a declared physical form. Rendering is the only
capability permitted to choose a serialization shape, and it may not alter
meaning.

- Decision `resolves-render-form` yields `render-canonical-json`,
  `render-row-table`, or `render-single-value`.
- Dispositions: `QUERY_RESULT_RENDERED`, `QUERY_RENDER_FORM_UNSUPPORTED`.

### routes-semantic-command

Routes a parsed command family to the capability that owns it. Routing is a
declared table, not a dispatch chain, and an unroutable family fails closed.

- Decision `resolves-command-route` maps command family to target capability.
- Dispositions: `SEMANTIC_COMMAND_ROUTED`, `SEMANTIC_COMMAND_UNROUTABLE`.

## Authority capabilities

### indexes-workspace-authority

Builds a deterministic index of workspace authority documents, classifying each
as semantic-executable or not, and recording a stable hash per entry.

- Decision `resolves-authority-index-scope` yields `index-declared-roots` or
  `index-explicit-paths`.
- Dispositions: `WORKSPACE_AUTHORITY_INDEXED`, `WORKSPACE_AUTHORITY_UNREADABLE`.

### resolves-query-selected-authority

Resolves which indexed authority document a query selects, by identity or by
declared selector, and fails closed on ambiguity.

- Decision `resolves-selected-authority-source` yields
  `select-by-identity`, `select-by-declared-selector`, or
  `reject-ambiguous-selection`.
- Dispositions: `SELECTED_AUTHORITY_RESOLVED`, `SELECTED_AUTHORITY_AMBIGUOUS`.

### resolves-authority-by-metadata

Resolves authority documents by declared metadata predicates (classification,
specification version, declared role) rather than by path.

- Decision `resolves-metadata-match-mode` yields `match-all-declared-metadata`
  or `match-any-declared-metadata`.
- Dispositions: `AUTHORITY_RESOLVED_BY_METADATA`, `AUTHORITY_METADATA_NO_MATCH`.

### composes-semantic-authority

Composes multiple authority documents into one derived authority view under a
declared precedence rule. Composition never merges silently: conflicting keys
must be resolved by a declared rule.

- Decision `resolves-composition-precedence` yields `later-declaration-wins`,
  `earlier-declaration-wins`, or `reject-conflicting-authority`.
- Dispositions: `SEMANTIC_AUTHORITY_COMPOSED`, `SEMANTIC_AUTHORITY_CONFLICT`.

### joins-semantic-authority

Joins authority facts across two declared semantic sources on a declared key.
Join kind is declared authority, not inferred from data.

- Decision `resolves-join-kind` yields `inner-join`, `left-outer-join`, or
  `reject-unjoinable-sources`.
- Dispositions: `SEMANTIC_AUTHORITY_JOINED`, `SEMANTIC_AUTHORITY_UNJOINABLE`.

### applies-semantic-policy-overlay

Applies a declared policy overlay onto resolved authority, tightening but never
loosening the underlying declaration.

- Decision `resolves-overlay-disposition` yields `apply-tightening-overlay`,
  `ignore-redundant-overlay`, or `reject-loosening-overlay`.
- Dispositions: `SEMANTIC_POLICY_OVERLAY_APPLIED`,
  `SEMANTIC_POLICY_OVERLAY_REJECTED`.

### lints-semantic-authority

Reports declared authority defects — missing identity, empty rules, implicit
fallback, unreachable rule — without repairing them.

- Decision `resolves-lint-severity` yields `blocking-defect`,
  `advisory-defect`, or `no-defect`.
- Dispositions: `SEMANTIC_AUTHORITY_LINTED`, `SEMANTIC_AUTHORITY_DEFECTIVE`.

## Execution capabilities

### constructs-semantic-execution-context

Builds the frozen execution context a subgraph executes against, binding
resolved authority, resolved source, and declared limits.

- Decision `resolves-execution-context-completeness` yields
  `context-complete` or `reject-incomplete-context`.
- Dispositions: `EXECUTION_CONTEXT_CONSTRUCTED`,
  `EXECUTION_CONTEXT_INCOMPLETE`.

### executes-selected-semantic-subgraph

Executes a declared execution model over a constructed context through the
kernel execution engine, returning the kernel receipt unaltered.

- Decision `resolves-subgraph-execution-mode` yields
  `execute-declared-model` or `reject-unregistered-model`.
- Dispositions: `SEMANTIC_SUBGRAPH_EXECUTED`, `SEMANTIC_SUBGRAPH_FAILED`.

### chains-semantic-results

Chains one capability's projected result into the next capability's input under
a declared contract-compatibility rule.

- Decision `resolves-chain-compatibility` yields `chain-compatible-contracts`
  or `reject-incompatible-chain`.
- Dispositions: `SEMANTIC_RESULTS_CHAINED`, `SEMANTIC_CHAIN_INCOMPATIBLE`.

### explains-semantic-execution

Projects a human-readable explanation of which authority governed an execution,
derived only from recorded testimony.

- Decision `resolves-explanation-depth` yields `explain-decisions-only` or
  `explain-full-step-testimony`.
- Dispositions: `SEMANTIC_EXECUTION_EXPLAINED`,
  `SEMANTIC_EXECUTION_UNEXPLAINABLE`.

## Proof and conformance capabilities

### projects-semantic-proof

Projects a canonical proof receipt from recorded execution testimony, asserting
the declared required assertions are all present.

- Decision `resolves-proof-completeness` yields `proof-complete` or
  `reject-incomplete-proof`.
- Dispositions: `SEMANTIC_PROOF_PROJECTED`, `SEMANTIC_PROOF_INCOMPLETE`.

### derives-conformance-vector-candidates

Derives candidate conformance vectors from declared authority. Candidates are
explicitly *not* accepted vectors; promotion remains a separate human gate.

- Decision `resolves-candidate-derivation-scope` yields
  `derive-per-decision-rule` or `derive-per-projection-field`.
- Dispositions: `CONFORMANCE_CANDIDATES_DERIVED`,
  `CONFORMANCE_CANDIDATES_UNDERIVABLE`.

### verifies-conformance-vector

Executes one conformance vector against live authority and compares the observed
result to the recorded expectation by canonical hash.

- Decision `resolves-vector-verification-outcome` yields `vector-passed`,
  `vector-failed`, or `vector-not-executable`.
- Dispositions: `CONFORMANCE_VECTOR_VERIFIED`, `CONFORMANCE_VECTOR_FAILED`.

### resolves-kernel-compatibility

Resolves whether the seated kernel satisfies the capability's declared required
primitive set and specification range.

- Decision `resolves-kernel-compatibility-disposition` yields
  `kernel-compatible`, `kernel-incompatible-primitives`, or
  `kernel-incompatible-specification`.
- Dispositions: `KERNEL_COMPATIBILITY_RESOLVED`, `KERNEL_INCOMPATIBLE`.

### projects-language-delegation-shell

Projects the language-specific delegation shell for a capability body from
language-neutral authority, proving the projection boundary is mechanical.

- Decision `resolves-delegation-shell-target` yields
  `project-declared-target-shell` or `reject-unsupported-target`.
- Dispositions: `DELEGATION_SHELL_PROJECTED`,
  `DELEGATION_SHELL_TARGET_UNSUPPORTED`.

## Promotion posture

A capability is `implemented` only when all of the following hold:

1. its authority is kernel-native and registers without error,
2. its contracts are concrete — no opaque `payload` or `value`,
3. it executes live against the kernel in an integration test,
4. its conformance vectors are `accepted` with `kernelExecution: passed`,
5. and recorded expectations match observed output by canonical hash.

Anything short of that stays `drafted`.
