import type { RoutesSemanticCommandContext } from "../types/routes-semantic-command-context.type.js";

export async function routesSemanticCommand(context: RoutesSemanticCommandContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-routes-semantic-command-authority", context);
  const execution = await context.edges.invokes("executes-resolved-routes-semantic-command", authority);
  const receipt = context.edges.projects("projects-routes-semantic-command-receipt", execution);
  return context.edges.invokes("validates-routes-semantic-command-receipt", receipt);
}
