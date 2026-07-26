import type { ExecutesRelationalQueryContext } from "../types/executes-relational-query-context.type.js";

export async function executesRelationalQuery(context: ExecutesRelationalQueryContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-executes-relational-query-authority", context);
  const execution = await context.edges.invokes("executes-resolved-executes-relational-query", authority);
  const receipt = context.edges.projects("projects-executes-relational-query-receipt", execution);
  return context.edges.invokes("validates-executes-relational-query-receipt", receipt);
}
