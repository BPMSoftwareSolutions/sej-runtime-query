# Applies semantic policy overlay

**Posture:** implemented

**Owned outcome:** Apply an explicit policy overlay without mutating source authority.

## Owned decision

`resolves-overlay-disposition` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `reject-loosening-overlay` | `reject-loosening-overlay` |
| `apply-tightening-overlay` | `apply-tightening-overlay` |
| `ignore-redundant-overlay` | `ignore-redundant-overlay` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `SEMANTIC_POLICY_OVERLAY_APPLIED` — the declared outcome was projected and validated.
- `SEMANTIC_POLICY_OVERLAY_REJECTED` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
