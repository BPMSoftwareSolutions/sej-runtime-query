import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ComposesSemanticAuthorityContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
