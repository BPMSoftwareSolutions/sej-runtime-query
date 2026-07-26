import type { ChainsSemanticResultsContext } from "../types/chains-semantic-results-context.type.js";

export async function chainsSemanticResults(context: ChainsSemanticResultsContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-chains-semantic-results-authority", context);
  const execution = await context.edges.invokes("executes-resolved-chains-semantic-results", authority);
  const receipt = context.edges.projects("projects-chains-semantic-results-receipt", execution);
  return context.edges.invokes("validates-chains-semantic-results-receipt", receipt);
}
