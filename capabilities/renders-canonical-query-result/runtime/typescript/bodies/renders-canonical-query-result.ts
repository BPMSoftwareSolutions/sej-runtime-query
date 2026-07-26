import type { RendersCanonicalQueryResultContext } from "../types/renders-canonical-query-result-context.type.js";

export async function rendersCanonicalQueryResult(context: RendersCanonicalQueryResultContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-renders-canonical-query-result-authority", context);
  const execution = await context.edges.invokes("executes-resolved-renders-canonical-query-result", authority);
  const receipt = context.edges.projects("projects-renders-canonical-query-result-receipt", execution);
  return context.edges.invokes("validates-renders-canonical-query-result-receipt", receipt);
}
