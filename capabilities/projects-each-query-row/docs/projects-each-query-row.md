# Projects each query row

**Posture:** implemented

**Owned outcome:** Project each selected row independently under declared row scope.

## Owned decision

`resolves-row-projection-order` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reverse-order` | `reverse` |
| `source-order` | `source` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `QUERY_ROWS_PROJECTED` — the declared outcome was projected and validated.
- `QUERY_ROW_PROJECTION_REJECTED` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
