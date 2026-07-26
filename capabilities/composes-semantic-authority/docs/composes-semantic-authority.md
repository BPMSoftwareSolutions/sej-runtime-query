# Composes semantic authority

**Posture:** implemented

**Owned outcome:** Compose compatible semantic authorities under declared composition policy.

## Owned decision

`resolves-composition-precedence` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reject-conflicting-authority` | `reject-conflicting-authority` |
| `earlier-declaration-wins` | `earlier-declaration-wins` |
| `later-declaration-wins` | `later-declaration-wins` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `SEMANTIC_AUTHORITY_COMPOSED` — the declared outcome was projected and validated.
- `SEMANTIC_AUTHORITY_CONFLICT` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
