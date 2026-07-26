import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type IndexesWorkspaceAuthorityContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
