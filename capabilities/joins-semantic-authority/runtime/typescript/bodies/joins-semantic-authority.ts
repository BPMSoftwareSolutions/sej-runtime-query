import type { JoinsSemanticAuthorityContext } from "../types/joins-semantic-authority-context.type.js";

export async function joinsSemanticAuthority(context: JoinsSemanticAuthorityContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-joins-semantic-authority-authority", context);
  const execution = await context.edges.invokes("executes-resolved-joins-semantic-authority", authority);
  const receipt = context.edges.projects("projects-joins-semantic-authority-receipt", execution);
  return context.edges.invokes("validates-joins-semantic-authority-receipt", receipt);
}
