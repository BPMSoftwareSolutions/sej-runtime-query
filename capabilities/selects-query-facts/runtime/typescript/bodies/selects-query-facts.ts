import type { SelectsQueryFactsContext } from "../types/selects-query-facts-context.type.js";

export async function selectsQueryFacts(context: SelectsQueryFactsContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-selects-query-facts-authority", context);
  const execution = await context.edges.invokes("executes-resolved-selects-query-facts", authority);
  const receipt = context.edges.projects("projects-selects-query-facts-receipt", execution);
  return context.edges.invokes("validates-selects-query-facts-receipt", receipt);
}
