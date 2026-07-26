import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type QueryEngine = Readonly<{
  edges: SemanticEdges;
  invoke(request: unknown): Promise<unknown>;
}>;
