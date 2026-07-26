# Resolves query source

**Posture:** implemented

**Owned outcome:** Resolve one authorized source for a canonical query command.

## Owned decision

`resolves-query-source-selection` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `use-explicit-source` | `use-explicit-source` |
| `use-workspace-default-source` | `use-workspace-default-source` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `QUERY_SOURCE_RESOLVED` — the declared outcome was projected and validated.
- `QUERY_SOURCE_UNRESOLVED` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
