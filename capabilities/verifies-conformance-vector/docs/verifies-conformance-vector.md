# Verifies conformance vector

**Posture:** implemented

**Owned outcome:** Verify one conformance vector against selected semantic authority and observed result.

## Owned decision

`resolves-vector-verification-outcome` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `vector-not-executable` | `vector-not-executable` |
| `vector-passed` | `vector-passed` |
| `vector-failed` | `vector-failed` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `CONFORMANCE_VECTOR_VERIFIED` — the declared outcome was projected and validated.
- `CONFORMANCE_VECTOR_FAILED` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
