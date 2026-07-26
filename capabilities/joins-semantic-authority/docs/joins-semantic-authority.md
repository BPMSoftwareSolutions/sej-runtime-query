# Joins semantic authority

**Posture:** implemented

**Owned outcome:** Join authority facts across declared semantic sources.

## Owned decision

`resolves-join-kind` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reject-unjoinable-sources` | `reject-unjoinable-sources` |
| `left-outer-join` | `left-outer-join` |
| `inner-join` | `inner-join` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `SEMANTIC_AUTHORITY_JOINED` — the declared outcome was projected and validated.
- `SEMANTIC_AUTHORITY_UNJOINABLE` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
