import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type DerivesConformanceVectorCandidatesContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
