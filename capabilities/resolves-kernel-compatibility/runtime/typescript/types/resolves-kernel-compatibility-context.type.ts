import type { SemanticEdges } from "@deterministic-solutions/semantic-kernel";

export type ResolvesKernelCompatibilityContext = Readonly<{
  edges: SemanticEdges;
  request: unknown;
}>;
