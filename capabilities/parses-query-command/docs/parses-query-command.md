# Parses query command

**Posture:** implemented

**Owned outcome:** Produce one canonical query command from submitted query text.

## Owned decision

`resolves-query-command-family` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `select-command` | `select-command` |
| `describe-command` | `describe-command` |
| `explain-command` | `explain-command` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `QUERY_COMMAND_PARSED` — the declared outcome was projected and validated.
- `QUERY_COMMAND_UNPARSABLE` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
