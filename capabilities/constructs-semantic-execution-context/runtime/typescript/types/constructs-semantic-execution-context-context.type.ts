import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ConstructsSemanticExecutionContextContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
