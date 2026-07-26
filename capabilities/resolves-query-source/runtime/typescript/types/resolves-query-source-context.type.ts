import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ResolvesQuerySourceContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
