import type { ExplainsSemanticExecutionContext } from "../types/explains-semantic-execution-context.type.js";

export async function explainsSemanticExecution(context: ExplainsSemanticExecutionContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-explains-semantic-execution-authority", context);
  const execution = await context.edges.invokes("executes-resolved-explains-semantic-execution", authority);
  const receipt = context.edges.projects("projects-explains-semantic-execution-receipt", execution);
  return context.edges.invokes("validates-explains-semantic-execution-receipt", receipt);
}
