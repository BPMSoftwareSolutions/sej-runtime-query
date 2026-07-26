# Resolves query selected authority

**Posture:** implemented

**Owned outcome:** Resolve executable semantic authority selected by a query.

## Owned decision

`resolves-selected-authority-source` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `select-by-identity` | `select-by-identity` |
| `reject-ambiguous-selection` | `reject-ambiguous-selection` |
| `select-by-declared-selector` | `select-by-declared-selector` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `SELECTED_AUTHORITY_RESOLVED` — the declared outcome was projected and validated.
- `SELECTED_AUTHORITY_AMBIGUOUS` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
