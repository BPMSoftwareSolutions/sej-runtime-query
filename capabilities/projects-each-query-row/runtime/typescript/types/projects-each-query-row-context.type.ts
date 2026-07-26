import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ProjectsEachQueryRowContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
