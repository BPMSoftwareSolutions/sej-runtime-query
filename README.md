# SEJ Runtime Query

A capability-first, language-neutral semantic executable JSON query engine.

The repository separates query fact selection from semantic result projection:

```text
Query command
    ↓
Canonical query result envelope
    ↓
Resolved semantic projection authority
    ↓
@deterministic-solutions/semantic-kernel
    ↓
Declared ports and mechanical adapters
    ↓
Canonical projection receipt
```

## Architectural commitments

- Canonical intent, features, contracts, authority, projections, and execution models remain language-neutral.
- `@deterministic-solutions/semantic-kernel` supplies predicate, decision, projection, iteration, execution, port-dispatch, and testimony machinery.
- TypeScript exists only below the projection boundary.
- Capability bodies may observe, invoke, project, and return. They may not author decisions, loops, retries, fallbacks, DTO mappings, or failure classifications.
- Legacy resolver assets enter through `migration/legacy-runtime-resolver` as evidence and require explicit admission before becoming authority.
- Generated `evidence/` and `reports/` are never source truth.

## Implemented surface

All 25 capabilities are implemented and proven. Each one declares its own
kernel-native decision, result projection, concrete contracts, and two accepted
conformance vectors — one proving the declared success path, one proving
declared rejection.

`applies-semantic-projection` remains the reference capability for external
projection-authority resolution; it declares:

1. A canonical query-result envelope.
2. Deterministic projection authority resolution.
3. Row and complete-result scopes.
4. Missing-value, invalid-row, cardinality, additional-field, and ordering policies.
5. A collapsed TypeScript body.
6. Canonical proof-receipt requirements.

The other 24 seat their own declared authority on a kernel through
`composition-root/shared/creates-capability-runtime.ts`. Their declared meaning
is recorded in [architecture/capability-semantics.md](architecture/capability-semantics.md).

Every capability body is an eight-line linear delegation:

```typescript
const authority = await context.edges.invokes("resolves-<capability>-authority", context);
const execution = await context.edges.invokes("executes-resolved-<capability>", authority);
const receipt = context.edges.projects("projects-<capability>-receipt", execution);
return context.edges.invokes("validates-<capability>-receipt", receipt);
```

### Fail-closed posture

A capability rejects rather than defaults. Three paths produce a declared
failure disposition with recorded findings, never an unclassified escape:

- a declared rejection rule resolves,
- no declared rule matches the input (`noMatchDisposition: reject`),
- or the kernel raises a declared error during execution.

## Proof posture

Currently proven by repository-local conformance checks:

- capability body shape,
- language neutrality above the projection boundary,
- one scenario outline and one body per capability,
- port-boundary isolation,
- canonical receipt-schema completeness,
- migration evidence isolation,
- external semantic-kernel dependency declaration,
- compilation against the adjacent semantic-kernel's emitted declarations,
- live row-scoped and complete-result projection execution,
- live missing-required-path rejection,
- input, result, and receipt contract validation,
- deterministic authority, input, and result hashes,
- and fail-closed authority mismatch and workspace-escape handling.

Additionally proven for all 25 capabilities:

- live kernel execution of a declared success vector and a declared rejection vector,
- receipts compared against recorded expectations by deep equality,
- the resolved rule is one the capability's decision actually declares,
- determinism, request immutability, and concurrency safety,
- input-contract rejection,
- linear body delegation through declared edges in declared order,
- and rejection of undeclared semantic edges.

Also gated: no disguised conditionals, authored severity or disposition
literals, array mutation, or mutable state anywhere below the projection
boundary. That gate exists because an earlier revision of this work replaced
forbidden `if` statements with `(condition ? doThing : noop)()`, which is the
same branch in a costume. `scripts/check-no-disguised-decisionality.mjs` fails
on that pattern.

Not claimed:

- equivalence against a separately published semantic-kernel package,
- cross-language kernel equivalence,
- or legacy resolver behavioral parity.

Those remain promotion gates rather than inferred success. The query directory
also has no Git metadata, so commit and diff provenance cannot be shown.

## Commands

```bash
npm run check
npm test
npm run typecheck
npm run prove
```

`npm run prove` is the full local evidence pass: conformance checks, live integration tests,
type checking, clean package creation, installation into a fresh consumer, and execution
through the public API with the adjacent semantic-kernel package. Compilation uses that
package's emitted declarations; there is no ambient kernel API shim.
