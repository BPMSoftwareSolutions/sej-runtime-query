import type { IndexesWorkspaceAuthorityContext } from "../types/indexes-workspace-authority-context.type.js";

export async function indexesWorkspaceAuthority(context: IndexesWorkspaceAuthorityContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-indexes-workspace-authority-authority", context);
  const execution = await context.edges.invokes("executes-resolved-indexes-workspace-authority", authority);
  const receipt = context.edges.projects("projects-indexes-workspace-authority-receipt", execution);
  return context.edges.invokes("validates-indexes-workspace-authority-receipt", receipt);
}
