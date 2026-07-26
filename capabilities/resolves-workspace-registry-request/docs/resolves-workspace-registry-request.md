# Resolve workspace registry request

**Posture:** drafted scaffold; not executable and not promoted

**Owned outcome:** Resolve the canonical workspace root, workspace identity, output authority, and output exclusion for one registry build.

## Projection boundary

Canonical intent, decisions, policies, contracts, projections, execution models,
ports, effects, and proof requirements remain language-neutral. The TypeScript
capability body is generated from the semantic execution model and may contain
only resolve, execute, project, and return operations.

## Mechanical ports

- `observes-workspace-root` — Observe canonical path and directory accessibility without assigning a disposition.

## Published dependencies

- None. This capability is a family entry boundary.

## Implementation handoff

The semantic declarations in this body are deliberate scaffolds. A follow-on
implementation must replace the empty decision rules and projection expressions,
seat mechanical adapters behind the declared ports, execute candidate vectors
through the semantic kernel, and record observed receipts before changing the
capability status from `drafted`.
