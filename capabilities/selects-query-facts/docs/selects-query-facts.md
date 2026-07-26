# Selects query facts

**Posture:** implemented

**Owned outcome:** Select only the declared facts from resolved source rows.

## Owned decision

`resolves-fact-selection-mode` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `select-all-declared-facts` | `select-all-declared-facts` |
| `select-named-facts` | `select-named-facts` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `QUERY_FACTS_SELECTED` — the declared outcome was projected and validated.
- `QUERY_FACT_UNKNOWN_COLUMN` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
