import type { ResolvesQuerySourceContext } from "../types/resolves-query-source-context.type.js";

export async function resolvesQuerySource(context: ResolvesQuerySourceContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-resolves-query-source-authority", context);
  const execution = await context.edges.invokes("executes-resolved-resolves-query-source", authority);
  const receipt = context.edges.projects("projects-resolves-query-source-receipt", execution);
  return context.edges.invokes("validates-resolves-query-source-receipt", receipt);
}
