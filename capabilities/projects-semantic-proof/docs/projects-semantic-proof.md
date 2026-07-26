# Projects semantic proof

**Posture:** implemented

**Owned outcome:** Project canonical proof from declared and observed semantic execution facts.

## Owned decision

`resolves-proof-completeness` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reject-incomplete-proof` | `reject-incomplete-proof` |
| `proof-complete` | `proof-complete` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `SEMANTIC_PROOF_PROJECTED` — the declared outcome was projected and validated.
- `SEMANTIC_PROOF_INCOMPLETE` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
