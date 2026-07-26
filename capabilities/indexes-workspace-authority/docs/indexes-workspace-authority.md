# Indexes workspace authority

**Posture:** implemented

**Owned outcome:** Produce an inspectable index of semantic authority in a workspace.

## Owned decision

`resolves-authority-index-scope` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `index-explicit-paths` | `index-explicit-paths` |
| `index-declared-roots` | `index-declared-roots` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `WORKSPACE_AUTHORITY_INDEXED` — the declared outcome was projected and validated.
- `WORKSPACE_AUTHORITY_UNREADABLE` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
