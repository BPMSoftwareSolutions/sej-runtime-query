import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ResolvesQuerySelectedAuthorityContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
