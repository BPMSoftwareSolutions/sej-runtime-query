# Discover workspace JSON documents

**Posture:** drafted scaffold; not executable and not promoted

**Owned outcome:** Discover JSON document candidates recursively beneath one authorized workspace root without escaping through symbolic links.

## Projection boundary

Canonical intent, decisions, policies, contracts, projections, execution models,
ports, effects, and proof requirements remain language-neutral. The TypeScript
capability body is generated from the semantic execution model and may contain
only resolve, execute, project, and return operations.

## Mechanical ports

- `lists-workspace-directory-entries` — List one authorized directory without choosing traversal policy.
- `observes-workspace-path-identity` — Observe path kind, canonical identity, and symbolic-link facts.

## Published dependencies

- `resolves-workspace-registry-request`

## Implementation handoff

The semantic declarations in this body are deliberate scaffolds. A follow-on
implementation must replace the empty decision rules and projection expressions,
seat mechanical adapters behind the declared ports, execute candidate vectors
through the semantic kernel, and record observed receipts before changing the
capability status from `drafted`.
