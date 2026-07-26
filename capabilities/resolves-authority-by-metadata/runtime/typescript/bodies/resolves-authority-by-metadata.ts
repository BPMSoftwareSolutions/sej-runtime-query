import type { ResolvesAuthorityByMetadataContext } from "../types/resolves-authority-by-metadata-context.type.js";

export async function resolvesAuthorityByMetadata(context: ResolvesAuthorityByMetadataContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-resolves-authority-by-metadata-authority", context);
  const execution = await context.edges.invokes("executes-resolved-resolves-authority-by-metadata", authority);
  const receipt = context.edges.projects("projects-resolves-authority-by-metadata-receipt", execution);
  return context.edges.invokes("validates-resolves-authority-by-metadata-receipt", receipt);
}
