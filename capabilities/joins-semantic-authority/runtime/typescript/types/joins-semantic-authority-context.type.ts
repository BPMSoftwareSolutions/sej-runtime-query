import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type JoinsSemanticAuthorityContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
