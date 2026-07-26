# Renders canonical query result

**Posture:** implemented

**Owned outcome:** Render canonical semantic content into a declared physical representation.

## Owned decision

`resolves-render-form` resolves under declared kernel predicates. No implicit
fallback exists: an input matching no rule is rejected.

| Rule | Resolves to |
| --- | --- |
| `render-canonical-json` | `render-canonical-json` |
| `render-row-table` | `render-row-table` |
| `render-single-value` | `render-single-value` |

Unmatched input resolves to `noMatchDisposition: reject`.

## Declared dispositions

- `QUERY_RESULT_RENDERED` — the declared outcome was projected and validated.
- `QUERY_RENDER_FORM_UNSUPPORTED` — the capability failed closed with recorded findings.

## Proof

Two accepted conformance vectors execute live against the semantic kernel: one
proving the declared success path, one proving declared rejection. Recorded
expectations are compared by canonical hash.
