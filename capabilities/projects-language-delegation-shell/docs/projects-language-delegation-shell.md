# Projects language delegation shell

**Posture:** implemented

**Owned outcome:** Project a language-specific delegation shell below the projection boundary.

## Owned decision

`resolves-delegation-shell-target` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reject-unsupported-target` | `reject-unsupported-target` |
| `project-declared-target-shell` | `project-declared-target-shell` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `DELEGATION_SHELL_PROJECTED` — the declared outcome was projected and validated.
- `DELEGATION_SHELL_TARGET_UNSUPPORTED` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
