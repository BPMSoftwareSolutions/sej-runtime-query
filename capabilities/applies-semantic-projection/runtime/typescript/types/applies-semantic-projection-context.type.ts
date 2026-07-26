import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type AppliesSemanticProjectionContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
