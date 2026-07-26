# Explains semantic execution

**Posture:** implemented

**Owned outcome:** Project an explainable plan for selected semantic execution.

## Owned decision

`resolves-explanation-depth` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reject-absent-testimony` | `reject-absent-testimony` |
| `explain-full-step-testimony` | `explain-full-step-testimony` |
| `explain-decisions-only` | `explain-decisions-only` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `SEMANTIC_EXECUTION_EXPLAINED` — the declared outcome was projected and validated.
- `SEMANTIC_EXECUTION_UNEXPLAINABLE` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
