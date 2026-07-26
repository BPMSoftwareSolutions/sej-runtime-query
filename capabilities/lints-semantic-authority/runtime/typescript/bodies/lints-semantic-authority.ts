import type { LintsSemanticAuthorityContext } from "../types/lints-semantic-authority-context.type.js";

export async function lintsSemanticAuthority(context: LintsSemanticAuthorityContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-lints-semantic-authority-authority", context);
  const execution = await context.edges.invokes("executes-resolved-lints-semantic-authority", authority);
  const receipt = context.edges.projects("projects-lints-semantic-authority-receipt", execution);
  return context.edges.invokes("validates-lints-semantic-authority-receipt", receipt);
}
