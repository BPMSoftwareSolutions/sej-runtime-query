import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type SelectsQueryFactsContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
