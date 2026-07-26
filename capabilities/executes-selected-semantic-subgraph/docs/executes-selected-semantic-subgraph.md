# Executes selected semantic subgraph

**Posture:** implemented

**Owned outcome:** Execute only the semantic subgraph authorized by the query.

## Owned decision

`resolves-subgraph-execution-mode` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reject-unregistered-model` | `reject-unregistered-model` |
| `execute-declared-model` | `execute-declared-model` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `SEMANTIC_SUBGRAPH_EXECUTED` — the declared outcome was projected and validated.
- `SEMANTIC_SUBGRAPH_FAILED` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
