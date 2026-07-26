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

This project follows the Deterministic Micro-Capability Engineering Standard.
Canonical intent and semantic authority are the source of truth.
Language-specific code bodies contain execution mechanics only. Decisions, DTO
shaping, control flow, ports, effects, and proof requirements are governed
through language-neutral semantic contracts.

- Canonical intent, features, contracts, authority, projections, and execution models remain language-neutral.
- `@deterministic-solutions/semantic-kernel` supplies predicate, decision, projection, iteration, execution, port-dispatch, and testimony machinery.
- TypeScript exists only below the projection boundary.
- Capability bodies may observe, invoke, project, and return. They may not author decisions, loops, retries, fallbacks, DTO mappings, or failure classifications.
- Legacy resolver assets enter through `migration/legacy-runtime-resolver` as evidence and require explicit admission before becoming authority.
- Generated `evidence/` and `reports/` are never source truth.

## Implemented surface

All 26 capabilities are implemented and proven. Each one declares its own
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

The other 25 seat their own declared authority on a kernel through
`composition-root/shared/creates-capability-runtime.ts`. Their declared meaning
is recorded in [architecture/capability-semantics.md](architecture/capability-semantics.md).

## Drafted workspace-registry family

Ten additional micro-capabilities now scaffold the legacy-equivalent
`scan:workspace` outcome. They cover request authority, recursive JSON discovery,
document observation, semantic classification, reference resolution, provenance,
summary, registry DTO projection, atomic persistence, and public composition.

These capabilities are deliberately `drafted`: their semantic decision rules and
projection expressions are empty, their port adapters are not seated, and their
candidate vectors are not evaluated. The current CLI does not yet claim
`scan:workspace` support.

The canonical scaffold and implementation handoff are documented in:

- [workspace-registry-capability-family.ascii.md](architecture/workspace-registry-capability-family.ascii.md)
- [workspace-registry-implementation-handoff.md](docs/workspace-registry-implementation-handoff.md)

Their TypeScript bodies are projected from semantic execution models and carry a
generated marker. Hand-authored body changes are forbidden.

The relational query capability also projects its TypeScript plan, expression,
source, execution-input, and result types from its query-owned JSON Schemas.
`relational-query.contract.ts` is generated code; schema changes must be
re-projected, and conformance rejects stale output.

Every implemented capability body is an eight-line linear delegation:

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
- executable workspace-registry scanning or persistence,
- or legacy resolver behavioral parity.

Those remain promotion gates rather than inferred success.

## Commands

```bash
npm run check
npm test
npm run typecheck
npm run prove
npm run scaffold:workspace-registry
npm run project:bodies
npm run project:types
npm run project:code
npm run check:projected-bodies
npm run check:projected-types
npm run check:projected-code
```

When the package is installed or linked, run SQL-style queries with the `q` wrapper:

```bash
npm run build
q --data examples/relational-demo.sources.json "SELECT c.name, SUM(o.amount) AS total FROM customers c JOIN orders o ON c.id = o.customerId GROUP BY c.name"
```

Without a global package link, use the equivalent repository-local command:

```bash
npm run q -- --data examples/relational-demo.sources.json "SELECT * FROM customers"
```

`npm run prove` is the full local evidence pass: conformance checks, live integration tests,
type checking, clean package creation, installation into a fresh consumer, and execution
through the public API with the adjacent semantic-kernel package. Compilation uses that
package's emitted declarations; there is no ambient kernel API shim.
