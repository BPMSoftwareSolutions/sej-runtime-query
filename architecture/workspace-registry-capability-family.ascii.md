# Workspace Registry Capability Family

This family scaffolds the legacy `scan:workspace` outcome under the Semantic
Kernel Software Delivery Standard, Deterministic Micro-Capability Engineering
Standard, and Four-Layer Discipline.

The legacy implementation is requirements evidence. It is not copied authority,
and observed legacy behavior is not automatically promoted.

```text
builds-workspace-registry
        |
        +--> resolves-workspace-registry-request
        |         |
        |         `--> canonical root, name, output, exclusion authority
        |
        +--> discovers-workspace-json-documents
        |         |
        |         `--> recursive discovery and symlink-boundary testimony
        |
        +--> observes-workspace-json-document
        |         |
        |         `--> read, parse, and content-hash observations
        |
        +--> classifies-workspace-json-document
        |         |
        |         `--> kind, SEJ posture, schema evidence, candidate roles
        |
        +--> resolves-workspace-document-references
        |         |
        |         `--> local references and dependency evidence
        |
        +--> records-workspace-registry-provenance
        |         |
        |         `--> snapshot and source-control testimony
        |
        +--> summarizes-workspace-registry
        |         |
        |         `--> declared summary counts
        |
        +--> projects-workspace-registry-snapshot
        |         |
        |         `--> complete canonical registry DTO and record hash
        |
        `--> persists-workspace-registry-snapshot
                  |
                  `--> authorized temporary write, atomic replacement, proof
```

## Projection boundary

```text
CANONICAL / LANGUAGE-NEUTRAL

intent
features
contracts
semantic observations
decisions and policies
failure and state models
ports and effects
DTO projections
iteration and execution models
proof requirements

-------------------- PROJECTION BOUNDARY --------------------

GENERATED / LANGUAGE-SPECIFIC

TypeScript immutable context type
TypeScript linear capability body
TypeScript registration seam
future mechanical port adapters
```

Every generated body has one fixed transcript:

```text
resolve authority
execute resolved authority
project receipt
return
```

No body may contain branching, iteration, fallback, retry, DTO construction,
filesystem access, JSON parsing, or failure classification.

## Legacy evidence coverage

| Legacy workspace-registry behavior | Owning scaffold |
| --- | --- |
| Default or explicit workspace root | `resolves-workspace-registry-request` |
| Default `.sej-query/registry.v1.json` output | `resolves-workspace-registry-request` |
| Recursive, case-insensitive JSON discovery | `discovers-workspace-json-documents` |
| Do not follow escaping symbolic links | `discovers-workspace-json-documents` |
| Preserve invalid and unreadable JSON evidence | `observes-workspace-json-document` |
| SEJ and JSON Schema classification | `classifies-workspace-json-document` |
| Candidate-role assignment | `classifies-workspace-json-document` |
| `$ref` and `$schema` evidence | `resolves-workspace-document-references` |
| Root-independent snapshot identity | `records-workspace-registry-provenance` |
| Deterministic counts | `summarizes-workspace-registry` |
| Canonical registry document | `projects-workspace-registry-snapshot` |
| Atomic replacement | `persists-workspace-registry-snapshot` |
| Public `scan:workspace` composition | `builds-workspace-registry` |

## Current promotion truth

All ten capabilities are `drafted`. Their decisions contain no rules, their
semantic projections contain no expressions, their adapters are not seated,
and their candidate vectors have not executed through the kernel. Structural
conformance is evidence of a complete scaffold only; it is not runtime parity.

