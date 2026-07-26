# Operator Proofbook

This document is meant to be read like an operator console trace.

It shows:

- the query text you can type,
- the semantic projection authority the engine resolves,
- the projected result you actually get back,
- and the failure modes that stay fail-closed.

The package exposes a standalone `q` binary. After `npm run build`, provide a JSON
object whose keys are source names and whose values are arrays of rows:

```text
q --data examples/relational-demo.sources.json "SELECT * FROM customers"
```

Inside this repository, the equivalent command is:

```text
npm run q -- --data examples/relational-demo.sources.json "SELECT * FROM customers"
```

## Mental model

```text
query text
  -> canonical query result envelope
  -> resolved projection authority
  -> projected result
  -> receipt
```

## 1. Parse a query command

Query text:

```text
SELECT * FROM registry APPLY PROJECTION project-capability-summary
```

What this proves:

- the command family is recognized as `select-command`,
- the normalized query text is preserved,
- the source and projection references are extracted,
- and the parser fails closed on non-query text.

Observed parse result:

```json
{
  "disposition": "QUERY_COMMAND_PARSED",
  "result": {
    "resultType": "parses-query-command-result.v1",
    "capabilityId": "parses-query-command",
    "value": {
      "commandFamily": "select-command",
      "normalizedText": "SELECT * FROM registry APPLY PROJECTION project-capability-summary",
      "sourceRef": "registry",
      "projectionRef": "project-capability-summary",
      "hasWhere": false,
      "hasLimit": false
    }
  }
}
```

Rejected parse example:

```text
MUTATE registry SET x = 1
```

Observed rejection:

```json
{
  "disposition": "QUERY_COMMAND_UNPARSABLE",
  "findings": [
    {
      "findingId": "no-declared-rule-matched",
      "detail": {
        "decisionId": "resolves-query-command-family",
        "observation": {
          "textLength": 25
        }
      }
    }
  ]
}
```

## 2. Project a single row

Command pattern:

```text
SELECT * FROM registry APPLY PROJECTION project-capability-summary
```

Live input fixture:

- [applies-row-projection.input.json](../capabilities/applies-semantic-projection/proof/fixtures/applies-row-projection.input.json)

Live projection authority:

- [project-capability-summary.sej.v1.json](../examples/workspaces/projection-demo/.sej-query/projections/project-capability-summary.sej.v1.json)

What this proves:

- row-scoped projection works,
- nested source reads work,
- conditional field shaping works,
- projection authority is explicit,
- and the result is a projected semantic object rather than raw source JSON.

Observed projected result:

```json
{
  "projectedResultType": "projected-query-result.v1",
  "projectionId": "project-capability-summary",
  "scope": "each-row",
  "value": [
    {
      "capabilityPath": "capabilities/file-system-shaper.json",
      "classification": "SEJ",
      "specificationVersion": "1.0.0"
    }
  ],
  "inputRowCount": 1,
  "projectedRowCount": 1,
  "rejectedRowCount": 0,
  "diagnostics": []
}
```

Receipt summary:

```json
{
  "disposition": "QUERY_RESULT_PROJECTED",
  "projectionId": "project-capability-summary",
  "scope": "each-row",
  "inputRowCount": 1,
  "projectedRowCount": 1,
  "rejectedRowCount": 0
}
```

## 3. Project a whole result set

Command pattern:

```text
SELECT relativePath, sejClassification FROM registry APPLY RESULT PROJECTION project-workspace-capability-report
```

Live input fixture:

- [applies-result-set-projection.input.json](../capabilities/applies-semantic-projection/proof/fixtures/applies-result-set-projection.input.json)

Live projection authority:

- [project-workspace-capability-report.sej.v1.json](../examples/workspaces/projection-demo/.sej-query/projections/project-workspace-capability-report.sej.v1.json)

What this proves:

- complete-result projection works,
- filtering and counting are allowed inside the projection,
- the projection can synthesize an aggregate report from the query result,
- and the result can contain nested arrays and derived totals.

Observed projected result:

```json
{
  "projectedResultType": "projected-query-result.v1",
  "projectionId": "project-workspace-capability-report",
  "scope": "complete-result",
  "value": {
    "reportType": "workspace-capability-report.v1",
    "capabilityCount": 1,
    "otherDocumentCount": 1,
    "capabilities": [
      {
        "path": "capabilities/file-system-shaper.json"
      }
    ]
  },
  "inputRowCount": 2,
  "projectedRowCount": 1,
  "rejectedRowCount": 0,
  "diagnostics": []
}
```

Receipt summary:

```json
{
  "disposition": "QUERY_RESULT_PROJECTED",
  "projectionId": "project-workspace-capability-report",
  "scope": "complete-result",
  "inputRowCount": 2,
  "projectedRowCount": 1,
  "rejectedRowCount": 0
}
```

## 4. Project an empty result without inventing rows

Same command family, but with an empty result set:

```text
SELECT relativePath, sejClassification FROM registry APPLY RESULT PROJECTION project-workspace-capability-report
```

What changes:

- `rows` becomes `[]`,
- `rowCount` becomes `0`,
- and the projection still returns one aggregate report instead of fabricating source rows.

Observed projected result:

```json
{
  "projectedResultType": "projected-query-result.v1",
  "projectionId": "project-workspace-capability-report",
  "scope": "complete-result",
  "value": {
    "reportType": "workspace-capability-report.v1",
    "capabilityCount": 0,
    "otherDocumentCount": 0,
    "capabilities": []
  },
  "inputRowCount": 0,
  "projectedRowCount": 1,
  "rejectedRowCount": 0,
  "diagnostics": []
}
```

## 5. Reject a missing required path

Same row-scoped projection as section 2, but the required source path is absent.

What this proves:

- missing required source fields do not get patched in,
- the projection rejects instead of guessing,
- and the failure is recorded as a declared finding.

Observed rejection:

```json
{
  "disposition": "QUERY_PROJECTION_REJECTED",
  "projectionId": "project-capability-summary",
  "scope": "each-row",
  "inputRowCount": 1,
  "projectedRowCount": 0,
  "rejectedRowCount": 1,
  "findings": [
    {
      "findingId": "required-source-path-missing",
      "path": "$.relativePath"
    }
  ]
}
```

## 6. How to inspect and edit the commands yourself

These are the pieces you can change when you want to explore deeper:

- Query text lives in the `query.normalizedText` field.
- Source selection lives in `queryResult.selection.columns`.
- The concrete rows live in `queryResult.rows`.
- Projection identity lives in `selector.projectionId`.
- Projection authority lives in the projection file under `.sej-query/projections/`.

The two demo projections worth editing first are:

- [project-capability-summary.sej.v1.json](../examples/workspaces/projection-demo/.sej-query/projections/project-capability-summary.sej.v1.json)
- [project-workspace-capability-report.sej.v1.json](../examples/workspaces/projection-demo/.sej-query/projections/project-workspace-capability-report.sej.v1.json)

The two input fixtures worth editing first are:

- [applies-row-projection.input.json](../capabilities/applies-semantic-projection/proof/fixtures/applies-row-projection.input.json)
- [applies-result-set-projection.input.json](../capabilities/applies-semantic-projection/proof/fixtures/applies-result-set-projection.input.json)

If you want to push the engine harder, the next useful experiments are:

1. Add another selected column to the query result and map it into the row projection.
2. Add a deeper nested `read` path inside the projection expression.
3. Change the `where` filter in the complete-result projection and inspect the totals.
4. Replace the input rows with a shape that violates the required source path and watch it fail closed.

## 7. What this repository currently proves

- Query text can be parsed into an explicit command family.
- Query results can be projected per row or as a complete result.
- Projections can read nested values, branch conditionally, filter collections, count collections, and map collections.
- Empty results stay empty instead of being invented.
- Missing required paths reject instead of being silently filled.
- Every successful run is receipt-backed and count-backed.
