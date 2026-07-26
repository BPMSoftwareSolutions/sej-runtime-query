# Executes relational query

This capability accepts a declared SQL-style `SELECT` or `WITH` query and named,
caller-supplied arrays of JSON rows. It resolves the query's admissibility through
semantic authority, executes the immutable relational plan through a query-owned
mechanical adapter, and projects a receipt through the external domain-neutral
semantic kernel.

Authority resolution snapshots the caller's JSON request and retains the parsed
plan in the resolved observation. Execution consumes that exact plan; it never
reparses caller-owned command text after the decision boundary. The adapter is
seated and invoked as `executes-query-owned-relational-plan`, and its declared
input and output contracts are validated at the port boundary.

The TypeScript contract used by the parser and adapter is generated from the
three query-owned JSON Schemas through
`projectors/typescript/json-schema-types.projection.v1.json`. Run
`npm run project:types` after changing those schemas; repository conformance
fails if the generated contract is stale.

Declared surface:

- inner, left, right, full, and cross joins;
- `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `DISTINCT`, `LIMIT`, and `OFFSET`;
- common table expressions;
- `COUNT`, `SUM`, `AVG`, `MIN`, and `MAX`;
- arithmetic, comparison, Boolean, `LIKE`, `IN`, and null predicates;
- `LOWER`, `UPPER`, `LENGTH`, and `COALESCE`;
- ad hoc result expressions and aliases under explicit query-declared projection authority.

The capability does not load or invent sources. Every named source is supplied in
the request, and an unresolved name fails closed.

The semantic kernel does not contain SQL, relational-plan, join, grouping, or
aggregation vocabulary. The language-neutral plan contract and policy are owned
by this capability; parsing and row evaluation are replaceable mechanics below
this capability's adapter boundary.
