import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type LintsSemanticAuthorityContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
