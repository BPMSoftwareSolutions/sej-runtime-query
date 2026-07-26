import type { AppliesSemanticPolicyOverlayContext } from "../types/applies-semantic-policy-overlay-context.type.js";

export async function appliesSemanticPolicyOverlay(context: AppliesSemanticPolicyOverlayContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-applies-semantic-policy-overlay-authority", context);
  const execution = await context.edges.invokes("executes-resolved-applies-semantic-policy-overlay", authority);
  const receipt = context.edges.projects("projects-applies-semantic-policy-overlay-receipt", execution);
  return context.edges.invokes("validates-applies-semantic-policy-overlay-receipt", receipt);
}
