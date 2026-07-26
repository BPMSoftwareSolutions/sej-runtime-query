import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ExplainsSemanticExecutionContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
