# Observe workspace JSON document

**Posture:** drafted scaffold; not executable and not promoted

**Owned outcome:** Read one authorized workspace JSON document and report content, parse, and hash observations without classification.

## Projection boundary

Canonical intent, decisions, policies, contracts, projections, execution models,
ports, effects, and proof requirements remain language-neutral. The TypeScript
capability body is generated from the semantic execution model and may contain
only resolve, execute, project, and return operations.

## Mechanical ports

- `reads-workspace-document-content` — Read bytes from one authorized path.
- `parses-json-text` — Attempt JSON parsing and report mechanical success or failure.
- `computes-document-content-hash` — Calculate a declared hash over observed content.

## Published dependencies

- `discovers-workspace-json-documents`

## Implementation handoff

The semantic declarations in this body are deliberate scaffolds. A follow-on
implementation must replace the empty decision rules and projection expressions,
seat mechanical adapters behind the declared ports, execute candidate vectors
through the semantic kernel, and record observed receipts before changing the
capability status from `drafted`.
