import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ResolvesAuthorityByMetadataContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
