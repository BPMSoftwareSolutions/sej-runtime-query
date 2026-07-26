import type { ProjectsCompleteQueryResultContext } from "../types/projects-complete-query-result-context.type.js";

export async function projectsCompleteQueryResult(context: ProjectsCompleteQueryResultContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-projects-complete-query-result-authority", context);
  const execution = await context.edges.invokes("executes-resolved-projects-complete-query-result", authority);
  const receipt = context.edges.projects("projects-projects-complete-query-result-receipt", execution);
  return context.edges.invokes("validates-projects-complete-query-result-receipt", receipt);
}
