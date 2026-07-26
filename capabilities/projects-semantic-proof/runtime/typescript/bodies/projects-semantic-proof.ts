import type { ProjectsSemanticProofContext } from "../types/projects-semantic-proof-context.type.js";

export async function projectsSemanticProof(context: ProjectsSemanticProofContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-projects-semantic-proof-authority", context);
  const execution = await context.edges.invokes("executes-resolved-projects-semantic-proof", authority);
  const receipt = context.edges.projects("projects-projects-semantic-proof-receipt", execution);
  return context.edges.invokes("validates-projects-semantic-proof-receipt", receipt);
}
