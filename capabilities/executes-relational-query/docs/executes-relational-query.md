# Executes relational query

This capability accepts a declared SQL-style `SELECT` or `WITH` query and named,
caller-supplied arrays of JSON rows. It resolves the query's admissibility through
semantic authority, executes the immutable relational plan through the external,
domain-neutral semantic kernel, and projects a receipt.

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
