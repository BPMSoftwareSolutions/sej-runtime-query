import type { ComposesSemanticAuthorityContext } from "../types/composes-semantic-authority-context.type.js";

export async function composesSemanticAuthority(context: ComposesSemanticAuthorityContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-composes-semantic-authority-authority", context);
  const execution = await context.edges.invokes("executes-resolved-composes-semantic-authority", authority);
  const receipt = context.edges.projects("projects-composes-semantic-authority-receipt", execution);
  return context.edges.invokes("validates-composes-semantic-authority-receipt", receipt);
}
