import type { ExecutesSelectedSemanticSubgraphContext } from "../types/executes-selected-semantic-subgraph-context.type.js";

export async function executesSelectedSemanticSubgraph(context: ExecutesSelectedSemanticSubgraphContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-executes-selected-semantic-subgraph-authority", context);
  const execution = await context.edges.invokes("executes-resolved-executes-selected-semantic-subgraph", authority);
  const receipt = context.edges.projects("projects-executes-selected-semantic-subgraph-receipt", execution);
  return context.edges.invokes("validates-executes-selected-semantic-subgraph-receipt", receipt);
}
