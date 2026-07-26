import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ParsesQueryCommandContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
