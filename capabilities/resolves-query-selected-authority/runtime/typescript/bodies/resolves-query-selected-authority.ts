import type { ResolvesQuerySelectedAuthorityContext } from "../types/resolves-query-selected-authority-context.type.js";

export async function resolvesQuerySelectedAuthority(context: ResolvesQuerySelectedAuthorityContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-resolves-query-selected-authority-authority", context);
  const execution = await context.edges.invokes("executes-resolved-resolves-query-selected-authority", authority);
  const receipt = context.edges.projects("projects-resolves-query-selected-authority-receipt", execution);
  return context.edges.invokes("validates-resolves-query-selected-authority-receipt", receipt);
}
