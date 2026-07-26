# Apply Semantic Projection

**Posture:** implemented; local conformance passed

The capability owns semantic output shaping after the query executor has produced a canonical query-result envelope.

```text
SELECT / WHERE / LIMIT
        |
        v
canonical query-result envelope
        |
        v
resolved projection authority
        |
        +--> each-row scope
        |
        `--> complete-result scope
        |
        v
contract-valid projected result + receipt
```

## Proven locally

- Compile against the adjacent semantic-kernel package's emitted declarations.
- Execute row, complete-result, empty-result, and missing-required-path cases through the real kernel.
- Prove deterministic receipts, input immutability, concurrent execution, schema validity, and fail-closed authority resolution.
- Pack both packages, install them into a fresh consumer, and execute through the public library API.

## Remaining external promotion gates

- Validate against the separately published semantic-kernel artifact.
- Establish cross-language canonical equivalence when non-TypeScript runtimes exist.
- Admit legacy fixtures individually; do not bulk-promote observed resolver behavior.
