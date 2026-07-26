import type { ProjectsEachQueryRowContext } from "../types/projects-each-query-row-context.type.js";

export async function projectsEachQueryRow(context: ProjectsEachQueryRowContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-projects-each-query-row-authority", context);
  const execution = await context.edges.invokes("executes-resolved-projects-each-query-row", authority);
  const receipt = context.edges.projects("projects-projects-each-query-row-receipt", execution);
  return context.edges.invokes("validates-projects-each-query-row-receipt", receipt);
}
