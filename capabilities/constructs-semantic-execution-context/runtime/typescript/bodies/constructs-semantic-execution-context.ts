import type { ConstructsSemanticExecutionContextContext } from "../types/constructs-semantic-execution-context-context.type.js";

export async function constructsSemanticExecutionContext(context: ConstructsSemanticExecutionContextContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-constructs-semantic-execution-context-authority", context);
  const execution = await context.edges.invokes("executes-resolved-constructs-semantic-execution-context", authority);
  const receipt = context.edges.projects("projects-constructs-semantic-execution-context-receipt", execution);
  return context.edges.invokes("validates-constructs-semantic-execution-context-receipt", receipt);
}
