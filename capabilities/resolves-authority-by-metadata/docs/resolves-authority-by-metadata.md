# Resolves authority by metadata

**Posture:** implemented

**Owned outcome:** Resolve semantic authority using declared metadata selectors.

## Owned decision

`resolves-metadata-match-mode` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reject-no-metadata-match` | `reject-no-metadata-match` |
| `match-any-declared-metadata` | `match-any-declared-metadata` |
| `match-all-declared-metadata` | `match-all-declared-metadata` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `AUTHORITY_RESOLVED_BY_METADATA` — the declared outcome was projected and validated.
- `AUTHORITY_METADATA_NO_MATCH` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
