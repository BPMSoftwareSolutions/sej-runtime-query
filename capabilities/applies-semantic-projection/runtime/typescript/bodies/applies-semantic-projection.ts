import type { AppliesSemanticProjectionContext } from "../types/applies-semantic-projection-context.type.js";

export async function appliesSemanticProjection(
  context: AppliesSemanticProjectionContext,
): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-projection-authority", context);
  const execution = await context.edges.invokes("executes-resolved-semantic-projection", authority);
  const receipt = context.edges.projects("projects-projection-receipt", execution);
  return context.edges.invokes("validates-projection-receipt", receipt);
}
