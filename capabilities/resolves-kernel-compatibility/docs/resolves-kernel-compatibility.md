# Resolves kernel compatibility

**Posture:** implemented

**Owned outcome:** Determine whether selected authority is executable by the seated semantic kernel.

## Owned decision

`resolves-kernel-compatibility-disposition` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `kernel-incompatible-primitives` | `kernel-incompatible-primitives` |
| `kernel-incompatible-specification` | `kernel-incompatible-specification` |
| `kernel-compatible` | `kernel-compatible` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `KERNEL_COMPATIBILITY_RESOLVED` — the declared outcome was projected and validated.
- `KERNEL_INCOMPATIBLE` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
