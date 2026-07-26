# Routes semantic command

**Posture:** implemented

**Owned outcome:** Route a canonical command to one declared command-family capability.

## Owned decision

`resolves-command-route` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `route-select-command` | `selects-query-facts` |
| `route-describe-command` | `indexes-workspace-authority` |
| `route-explain-command` | `explains-semantic-execution` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `SEMANTIC_COMMAND_ROUTED` — the declared outcome was projected and validated.
- `SEMANTIC_COMMAND_UNROUTABLE` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
