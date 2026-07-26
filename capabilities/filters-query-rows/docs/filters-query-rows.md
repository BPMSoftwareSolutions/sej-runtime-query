# Filters query rows

**Posture:** implemented

**Owned outcome:** Apply declared predicates to resolved source rows.

## Owned decision

`resolves-row-filter-mode` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reject-undeclared-predicate-operator` | `reject-undeclared-predicate-operator` |
| `apply-declared-predicate` | `apply-declared-predicate` |
| `pass-through-unfiltered` | `pass-through-unfiltered` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `QUERY_ROWS_FILTERED` — the declared outcome was projected and validated.
- `QUERY_FILTER_PREDICATE_INVALID` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
