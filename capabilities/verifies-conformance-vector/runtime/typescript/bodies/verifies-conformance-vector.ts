import type { VerifiesConformanceVectorContext } from "../types/verifies-conformance-vector-context.type.js";

export async function verifiesConformanceVector(context: VerifiesConformanceVectorContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-verifies-conformance-vector-authority", context);
  const execution = await context.edges.invokes("executes-resolved-verifies-conformance-vector", authority);
  const receipt = context.edges.projects("projects-verifies-conformance-vector-receipt", execution);
  return context.edges.invokes("validates-verifies-conformance-vector-receipt", receipt);
}
