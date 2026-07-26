import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ChainsSemanticResultsContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
