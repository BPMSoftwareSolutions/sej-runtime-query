# Resolve workspace document references

**Posture:** drafted scaffold; not executable and not promoted

**Owned outcome:** Resolve declared local schema references and dependency evidence across classified workspace documents.

## Projection boundary

Canonical intent, decisions, policies, contracts, projections, execution models,
ports, effects, and proof requirements remain language-neutral. The TypeScript
capability body is generated from the semantic execution model and may contain
only resolve, execute, project, and return operations.

## Mechanical ports

- `normalizes-workspace-relative-reference` — Resolve a relative path mechanically beneath an authorized workspace root.

## Published dependencies

- `classifies-workspace-json-document`

## Implementation handoff

The semantic declarations in this body are deliberate scaffolds. A follow-on
implementation must replace the empty decision rules and projection expressions,
seat mechanical adapters behind the declared ports, execute candidate vectors
through the semantic kernel, and record observed receipts before changing the
capability status from `drafted`.
