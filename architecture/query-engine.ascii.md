# Query Engine Architecture

```text
Intent + Feature + Contracts
              |
              v
1. Semantic Authority
              |
              v
2. Semantic Projections
              |
              v
3. Semantic Execution Models
              |
              v
Collapsed TypeScript Body
              |
              v
@deterministic-solutions/semantic-kernel
              |
              v
Declared Port Identity
              |
              v
4. Mechanical Adapter
              |
              v
Canonical Proof Receipt
```

## Capability flow

```text
Command doorway
      |
      v
parses-query-command
      |
      v
resolves-query-source
      |
      v
filters-query-rows --> selects-query-facts
                              |
                              v
                 canonical query-result envelope
                              |
                              v
               applies-semantic-projection
                    /                    \
                   v                      v
       projects-each-query-row   projects-complete-query-result
                    \                    /
                     v                  v
                 canonical projected result
                              |
                              v
                renders-canonical-query-result
                              |
                              v
                    proof receipt + output
```
