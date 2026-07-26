# Presents projected query result

This capability consumes a successful semantic projection receipt. It resolves an
already-promoted layout through schema metadata and the layout-shape registry,
binds projected fields to declared slots, and renders a semantic presentation
model for the terminal surface.

If no promoted layout applies, it returns canonical JSON. It never generates,
selects, or promotes layout candidates during query execution.
