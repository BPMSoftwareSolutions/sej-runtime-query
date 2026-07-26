# Record workspace registry provenance

**Posture:** drafted scaffold; not executable and not promoted

**Owned outcome:** Record reproducible workspace snapshot identity and available source-control testimony for one registry build.

## Projection boundary

Canonical intent, decisions, policies, contracts, projections, execution models,
ports, effects, and proof requirements remain language-neutral. The TypeScript
capability body is generated from the semantic execution model and may contain
only resolve, execute, project, and return operations.

## Mechanical ports

- `computes-workspace-snapshot-hash` — Calculate a declared hash from ordered document identity and content hashes.
- `observes-workspace-source-control` — Observe source-control identity without deciding whether absence is acceptable.

## Published dependencies

- `resolves-workspace-document-references`

## Implementation handoff

The semantic declarations in this body are deliberate scaffolds. A follow-on
implementation must replace the empty decision rules and projection expressions,
seat mechanical adapters behind the declared ports, execute candidate vectors
through the semantic kernel, and record observed receipts before changing the
capability status from `drafted`.
