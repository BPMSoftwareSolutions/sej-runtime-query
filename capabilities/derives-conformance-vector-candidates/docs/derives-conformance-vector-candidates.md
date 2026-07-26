# Derives conformance vector candidates

**Posture:** implemented

**Owned outcome:** Derive candidate conformance vectors from selected semantic authority.

## Owned decision

`resolves-candidate-derivation-scope` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reject-underivable-declaration` | `reject-underivable-declaration` |
| `derive-per-projection-field` | `derive-per-projection-field` |
| `derive-per-decision-rule` | `derive-per-decision-rule` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `CONFORMANCE_CANDIDATES_DERIVED` — the declared outcome was projected and validated.
- `CONFORMANCE_CANDIDATES_UNDERIVABLE` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
