import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type RoutesSemanticCommandContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
