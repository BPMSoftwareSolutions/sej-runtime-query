# Lints semantic authority

**Posture:** implemented

**Owned outcome:** Produce executable lint findings for selected semantic authority.

## Owned decision

`resolves-lint-severity` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `blocking-defect` | `blocking-defect` |
| `advisory-defect` | `advisory-defect` |
| `no-defect` | `no-defect` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `SEMANTIC_AUTHORITY_LINTED` — the declared outcome was projected and validated.
- `SEMANTIC_AUTHORITY_DEFECTIVE` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
