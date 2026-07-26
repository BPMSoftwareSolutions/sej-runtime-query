# Semantic Kernel Integration

The query engine consumes `@deterministic-solutions/semantic-kernel` as an external peer dependency.

Required primitive identities are declared under `kernel-compatibility/required-primitives.sej.v1.json`. The query engine must not implement local predicate evaluation, decision dispatch, semantic projection, declared iteration, state transition, port dispatch, or testimony recording.

Local development resolves the adjacent `../semantic-kernel` workspace as a file dependency,
and TypeScript compiles against that package's emitted declarations. The query package keeps
the kernel as a peer dependency for consumers; it does not contain an ambient kernel API shim
or a private kernel implementation.

The package proof builds and packs both workspaces, installs their tarballs into a fresh
consumer, imports the query package's public API, and executes the implemented projection
slice. Equivalence to a separately published kernel artifact remains an external promotion
gate.

Query grammar and relational-plan execution are capability-domain concerns. They
remain under `capabilities/executes-relational-query`; the semantic kernel must
not export SQL tokens, relational contracts, joins, grouping, aggregation, or
query-plan evaluation.

The query capability snapshots input before resolution, carries the parsed plan
as resolved authority, and invokes its mechanical adapter through the declared
`executes-query-owned-relational-plan` port. The generic runtime verifies the
port catalog binding and validates both port contracts; the kernel supplies only
the universal registry and dispatch mechanics.

The capability's TypeScript relational vocabulary is projected from the
query-owned plan, authorized-execution, and result schemas. The generated
contract is a replaceable language projection; it is not an independent source
of relational meaning.

```text
Capability body
      |
      v
SemanticEdges.invokes / SemanticEdges.projects
      |
      v
External semantic kernel
      |
      v
Registered semantic authority + seated ports
```
