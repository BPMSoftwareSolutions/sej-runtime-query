import type { ParsesQueryCommandContext } from "../types/parses-query-command-context.type.js";

export async function parsesQueryCommand(context: ParsesQueryCommandContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-parses-query-command-authority", context);
  const execution = await context.edges.invokes("executes-resolved-parses-query-command", authority);
  const receipt = context.edges.projects("projects-parses-query-command-receipt", execution);
  return context.edges.invokes("validates-parses-query-command-receipt", receipt);
}
