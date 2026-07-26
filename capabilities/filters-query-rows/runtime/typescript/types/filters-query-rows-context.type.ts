import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type FiltersQueryRowsContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
