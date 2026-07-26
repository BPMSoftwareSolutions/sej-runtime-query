import type { ResolvesKernelCompatibilityContext } from "../types/resolves-kernel-compatibility-context.type.js";

export async function resolvesKernelCompatibility(context: ResolvesKernelCompatibilityContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-resolves-kernel-compatibility-authority", context);
  const execution = await context.edges.invokes("executes-resolved-resolves-kernel-compatibility", authority);
  const receipt = context.edges.projects("projects-resolves-kernel-compatibility-receipt", execution);
  return context.edges.invokes("validates-resolves-kernel-compatibility-receipt", receipt);
}
