# Persist workspace registry snapshot

**Posture:** drafted scaffold; not executable and not promoted

**Owned outcome:** Persist one authorized workspace registry snapshot atomically without exposing a partial replacement.

## Projection boundary

Canonical intent, decisions, policies, contracts, projections, execution models,
ports, effects, and proof requirements remain language-neutral. The TypeScript
capability body is generated from the semantic execution model and may contain
only resolve, execute, project, and return operations.

## Mechanical ports

- `creates-registry-output-directory` — Create the authorized output directory.
- `writes-temporary-registry-snapshot` — Write one complete temporary registry artifact.
- `replaces-registry-snapshot-atomically` — Atomically replace the target with the completed temporary artifact.
- `observes-persisted-registry-hash` — Observe the persisted artifact hash for proof.

## Published dependencies

- `projects-workspace-registry-snapshot`

## Implementation handoff

The semantic declarations in this body are deliberate scaffolds. A follow-on
implementation must replace the empty decision rules and projection expressions,
seat mechanical adapters behind the declared ports, execute candidate vectors
through the semantic kernel, and record observed receipts before changing the
capability status from `drafted`.
