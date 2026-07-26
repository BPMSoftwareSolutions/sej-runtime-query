# Project workspace registry snapshot

**Posture:** drafted scaffold; not executable and not promoted

**Owned outcome:** Project the complete canonical workspace registry DTO and its record hash from resolved registry evidence.

## Projection boundary

Canonical intent, decisions, policies, contracts, projections, execution models,
ports, effects, and proof requirements remain language-neutral. The TypeScript
capability body is generated from the semantic execution model and may contain
only resolve, execute, project, and return operations.

## Mechanical ports

- `computes-workspace-registry-record-hash` — Calculate the declared canonical registry record hash.

## Published dependencies

- `records-workspace-registry-provenance`
- `summarizes-workspace-registry`

## Implementation handoff

The semantic declarations in this body are deliberate scaffolds. A follow-on
implementation must replace the empty decision rules and projection expressions,
seat mechanical adapters behind the declared ports, execute candidate vectors
through the semantic kernel, and record observed receipts before changing the
capability status from `drafted`.
