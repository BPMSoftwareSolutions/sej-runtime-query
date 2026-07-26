import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type QueryEngineContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
