import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type VerifiesConformanceVectorContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
