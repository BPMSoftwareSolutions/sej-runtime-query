import type { DerivesConformanceVectorCandidatesContext } from "../types/derives-conformance-vector-candidates-context.type.js";

export async function derivesConformanceVectorCandidates(context: DerivesConformanceVectorCandidatesContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-derives-conformance-vector-candidates-authority", context);
  const execution = await context.edges.invokes("executes-resolved-derives-conformance-vector-candidates", authority);
  const receipt = context.edges.projects("projects-derives-conformance-vector-candidates-receipt", execution);
  return context.edges.invokes("validates-derives-conformance-vector-candidates-receipt", receipt);
}
