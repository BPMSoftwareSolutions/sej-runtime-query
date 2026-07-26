import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ExecutesSelectedSemanticSubgraphContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
