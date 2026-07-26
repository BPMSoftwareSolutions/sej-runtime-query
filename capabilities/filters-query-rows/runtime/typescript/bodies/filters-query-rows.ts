import type { FiltersQueryRowsContext } from "../types/filters-query-rows-context.type.js";

export async function filtersQueryRows(context: FiltersQueryRowsContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-filters-query-rows-authority", context);
  const execution = await context.edges.invokes("executes-resolved-filters-query-rows", authority);
  const receipt = context.edges.projects("projects-filters-query-rows-receipt", execution);
  return context.edges.invokes("validates-filters-query-rows-receipt", receipt);
}
