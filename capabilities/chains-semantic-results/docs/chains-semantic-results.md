# Chains semantic results

**Posture:** implemented

**Owned outcome:** Pass canonical semantic results through an authorized dataflow.

## Owned decision

`resolves-chain-compatibility` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `chain-compatible-contracts` | `chain-compatible-contracts` |
| `reject-incompatible-chain` | `reject-incompatible-chain` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `SEMANTIC_RESULTS_CHAINED` — the declared outcome was projected and validated.
- `SEMANTIC_CHAIN_INCOMPATIBLE` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
