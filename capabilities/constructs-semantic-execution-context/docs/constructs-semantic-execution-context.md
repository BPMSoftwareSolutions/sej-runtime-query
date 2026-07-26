# Constructs semantic execution context

**Posture:** implemented

**Owned outcome:** Construct one immutable context from query-selected facts and authority.

## Owned decision

`resolves-execution-context-completeness` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reject-incomplete-context` | `reject-incomplete-context` |
| `context-complete` | `context-complete` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `EXECUTION_CONTEXT_CONSTRUCTED` — the declared outcome was projected and validated.
- `EXECUTION_CONTEXT_INCOMPLETE` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
