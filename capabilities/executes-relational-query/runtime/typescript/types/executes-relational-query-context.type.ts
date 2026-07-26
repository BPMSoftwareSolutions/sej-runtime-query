import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ExecutesRelationalQueryContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
