import type { JsonObject } from "@deterministic-solutions/semantic-kernel";
import { createsParsesQueryCommandRuntime } from "../capabilities/parses-query-command/runtime/typescript/registration/registers-parses-query-command-authority.js";
import { createsResolvesQuerySourceRuntime } from "../capabilities/resolves-query-source/runtime/typescript/registration/registers-resolves-query-source-authority.js";
import { createsSelectsQueryFactsRuntime } from "../capabilities/selects-query-facts/runtime/typescript/registration/registers-selects-query-facts-authority.js";
import { createsFiltersQueryRowsRuntime } from "../capabilities/filters-query-rows/runtime/typescript/registration/registers-filters-query-rows-authority.js";
import { createsProjectsEachQueryRowRuntime } from "../capabilities/projects-each-query-row/runtime/typescript/registration/registers-projects-each-query-row-authority.js";
import { createsProjectsCompleteQueryResultRuntime } from "../capabilities/projects-complete-query-result/runtime/typescript/registration/registers-projects-complete-query-result-authority.js";
import { createsRendersCanonicalQueryResultRuntime } from "../capabilities/renders-canonical-query-result/runtime/typescript/registration/registers-renders-canonical-query-result-authority.js";
import { createsRoutesSemanticCommandRuntime } from "../capabilities/routes-semantic-command/runtime/typescript/registration/registers-routes-semantic-command-authority.js";
import { createsIndexesWorkspaceAuthorityRuntime } from "../capabilities/indexes-workspace-authority/runtime/typescript/registration/registers-indexes-workspace-authority-authority.js";
import { createsResolvesQuerySelectedAuthorityRuntime } from "../capabilities/resolves-query-selected-authority/runtime/typescript/registration/registers-resolves-query-selected-authority-authority.js";
import { createsResolvesAuthorityByMetadataRuntime } from "../capabilities/resolves-authority-by-metadata/runtime/typescript/registration/registers-resolves-authority-by-metadata-authority.js";
import { createsComposesSemanticAuthorityRuntime } from "../capabilities/composes-semantic-authority/runtime/typescript/registration/registers-composes-semantic-authority-authority.js";
import { createsJoinsSemanticAuthorityRuntime } from "../capabilities/joins-semantic-authority/runtime/typescript/registration/registers-joins-semantic-authority-authority.js";
import { createsAppliesSemanticPolicyOverlayRuntime } from "../capabilities/applies-semantic-policy-overlay/runtime/typescript/registration/registers-applies-semantic-policy-overlay-authority.js";
import { createsLintsSemanticAuthorityRuntime } from "../capabilities/lints-semantic-authority/runtime/typescript/registration/registers-lints-semantic-authority-authority.js";
import { createsConstructsSemanticExecutionContextRuntime } from "../capabilities/constructs-semantic-execution-context/runtime/typescript/registration/registers-constructs-semantic-execution-context-authority.js";
import { createsExecutesSelectedSemanticSubgraphRuntime } from "../capabilities/executes-selected-semantic-subgraph/runtime/typescript/registration/registers-executes-selected-semantic-subgraph-authority.js";
import { createsChainsSemanticResultsRuntime } from "../capabilities/chains-semantic-results/runtime/typescript/registration/registers-chains-semantic-results-authority.js";
import { createsExplainsSemanticExecutionRuntime } from "../capabilities/explains-semantic-execution/runtime/typescript/registration/registers-explains-semantic-execution-authority.js";
import { createsProjectsSemanticProofRuntime } from "../capabilities/projects-semantic-proof/runtime/typescript/registration/registers-projects-semantic-proof-authority.js";
import { createsDerivesConformanceVectorCandidatesRuntime } from "../capabilities/derives-conformance-vector-candidates/runtime/typescript/registration/registers-derives-conformance-vector-candidates-authority.js";
import { createsVerifiesConformanceVectorRuntime } from "../capabilities/verifies-conformance-vector/runtime/typescript/registration/registers-verifies-conformance-vector-authority.js";
import { createsResolvesKernelCompatibilityRuntime } from "../capabilities/resolves-kernel-compatibility/runtime/typescript/registration/registers-resolves-kernel-compatibility-authority.js";
import { createsProjectsLanguageDelegationShellRuntime } from "../capabilities/projects-language-delegation-shell/runtime/typescript/registration/registers-projects-language-delegation-shell-authority.js";
import { parsesQueryCommand } from "../capabilities/parses-query-command/runtime/typescript/bodies/parses-query-command.js";
import { resolvesQuerySource } from "../capabilities/resolves-query-source/runtime/typescript/bodies/resolves-query-source.js";
import { selectsQueryFacts } from "../capabilities/selects-query-facts/runtime/typescript/bodies/selects-query-facts.js";
import { filtersQueryRows } from "../capabilities/filters-query-rows/runtime/typescript/bodies/filters-query-rows.js";
import { projectsEachQueryRow } from "../capabilities/projects-each-query-row/runtime/typescript/bodies/projects-each-query-row.js";
import { projectsCompleteQueryResult } from "../capabilities/projects-complete-query-result/runtime/typescript/bodies/projects-complete-query-result.js";
import { rendersCanonicalQueryResult } from "../capabilities/renders-canonical-query-result/runtime/typescript/bodies/renders-canonical-query-result.js";
import { routesSemanticCommand } from "../capabilities/routes-semantic-command/runtime/typescript/bodies/routes-semantic-command.js";
import { indexesWorkspaceAuthority } from "../capabilities/indexes-workspace-authority/runtime/typescript/bodies/indexes-workspace-authority.js";
import { resolvesQuerySelectedAuthority } from "../capabilities/resolves-query-selected-authority/runtime/typescript/bodies/resolves-query-selected-authority.js";
import { resolvesAuthorityByMetadata } from "../capabilities/resolves-authority-by-metadata/runtime/typescript/bodies/resolves-authority-by-metadata.js";
import { composesSemanticAuthority } from "../capabilities/composes-semantic-authority/runtime/typescript/bodies/composes-semantic-authority.js";
import { joinsSemanticAuthority } from "../capabilities/joins-semantic-authority/runtime/typescript/bodies/joins-semantic-authority.js";
import { appliesSemanticPolicyOverlay } from "../capabilities/applies-semantic-policy-overlay/runtime/typescript/bodies/applies-semantic-policy-overlay.js";
import { lintsSemanticAuthority } from "../capabilities/lints-semantic-authority/runtime/typescript/bodies/lints-semantic-authority.js";
import { constructsSemanticExecutionContext } from "../capabilities/constructs-semantic-execution-context/runtime/typescript/bodies/constructs-semantic-execution-context.js";
import { executesSelectedSemanticSubgraph } from "../capabilities/executes-selected-semantic-subgraph/runtime/typescript/bodies/executes-selected-semantic-subgraph.js";
import { chainsSemanticResults } from "../capabilities/chains-semantic-results/runtime/typescript/bodies/chains-semantic-results.js";
import { explainsSemanticExecution } from "../capabilities/explains-semantic-execution/runtime/typescript/bodies/explains-semantic-execution.js";
import { projectsSemanticProof } from "../capabilities/projects-semantic-proof/runtime/typescript/bodies/projects-semantic-proof.js";
import { derivesConformanceVectorCandidates } from "../capabilities/derives-conformance-vector-candidates/runtime/typescript/bodies/derives-conformance-vector-candidates.js";
import { verifiesConformanceVector } from "../capabilities/verifies-conformance-vector/runtime/typescript/bodies/verifies-conformance-vector.js";
import { resolvesKernelCompatibility } from "../capabilities/resolves-kernel-compatibility/runtime/typescript/bodies/resolves-kernel-compatibility.js";
import { projectsLanguageDelegationShell } from "../capabilities/projects-language-delegation-shell/runtime/typescript/bodies/projects-language-delegation-shell.js";
import { appliesSemanticProjection } from "../capabilities/applies-semantic-projection/runtime/typescript/bodies/applies-semantic-projection.js";
import type { CapabilityRuntime } from "./shared/creates-capability-runtime.js";

export type CapabilityBody = (context: Readonly<{ edges: unknown; request: unknown }>) => Promise<unknown>;

/**
 * Every implemented capability that seats its own declared authority on a
 * kernel. `applies-semantic-projection` is absent because it resolves external
 * projection authority and is constructed through its own factory.
 */
const runtimeFactories = new Map<string, () => CapabilityRuntime>([
  ["parses-query-command", createsParsesQueryCommandRuntime],
  ["resolves-query-source", createsResolvesQuerySourceRuntime],
  ["selects-query-facts", createsSelectsQueryFactsRuntime],
  ["filters-query-rows", createsFiltersQueryRowsRuntime],
  ["projects-each-query-row", createsProjectsEachQueryRowRuntime],
  ["projects-complete-query-result", createsProjectsCompleteQueryResultRuntime],
  ["renders-canonical-query-result", createsRendersCanonicalQueryResultRuntime],
  ["routes-semantic-command", createsRoutesSemanticCommandRuntime],
  ["indexes-workspace-authority", createsIndexesWorkspaceAuthorityRuntime],
  ["resolves-query-selected-authority", createsResolvesQuerySelectedAuthorityRuntime],
  ["resolves-authority-by-metadata", createsResolvesAuthorityByMetadataRuntime],
  ["composes-semantic-authority", createsComposesSemanticAuthorityRuntime],
  ["joins-semantic-authority", createsJoinsSemanticAuthorityRuntime],
  ["applies-semantic-policy-overlay", createsAppliesSemanticPolicyOverlayRuntime],
  ["lints-semantic-authority", createsLintsSemanticAuthorityRuntime],
  ["constructs-semantic-execution-context", createsConstructsSemanticExecutionContextRuntime],
  ["executes-selected-semantic-subgraph", createsExecutesSelectedSemanticSubgraphRuntime],
  ["chains-semantic-results", createsChainsSemanticResultsRuntime],
  ["explains-semantic-execution", createsExplainsSemanticExecutionRuntime],
  ["projects-semantic-proof", createsProjectsSemanticProofRuntime],
  ["derives-conformance-vector-candidates", createsDerivesConformanceVectorCandidatesRuntime],
  ["verifies-conformance-vector", createsVerifiesConformanceVectorRuntime],
  ["resolves-kernel-compatibility", createsResolvesKernelCompatibilityRuntime],
  ["projects-language-delegation-shell", createsProjectsLanguageDelegationShellRuntime],
]);

/**
 * Runtime bodies keyed by capability identity. Each body contains linear
 * semantic delegation only.
 */
const capabilityBodies = new Map<string, CapabilityBody>([
  ["parses-query-command", parsesQueryCommand as CapabilityBody],
  ["resolves-query-source", resolvesQuerySource as CapabilityBody],
  ["selects-query-facts", selectsQueryFacts as CapabilityBody],
  ["filters-query-rows", filtersQueryRows as CapabilityBody],
  ["projects-each-query-row", projectsEachQueryRow as CapabilityBody],
  ["projects-complete-query-result", projectsCompleteQueryResult as CapabilityBody],
  ["renders-canonical-query-result", rendersCanonicalQueryResult as CapabilityBody],
  ["routes-semantic-command", routesSemanticCommand as CapabilityBody],
  ["indexes-workspace-authority", indexesWorkspaceAuthority as CapabilityBody],
  ["resolves-query-selected-authority", resolvesQuerySelectedAuthority as CapabilityBody],
  ["resolves-authority-by-metadata", resolvesAuthorityByMetadata as CapabilityBody],
  ["composes-semantic-authority", composesSemanticAuthority as CapabilityBody],
  ["joins-semantic-authority", joinsSemanticAuthority as CapabilityBody],
  ["applies-semantic-policy-overlay", appliesSemanticPolicyOverlay as CapabilityBody],
  ["lints-semantic-authority", lintsSemanticAuthority as CapabilityBody],
  ["constructs-semantic-execution-context", constructsSemanticExecutionContext as CapabilityBody],
  ["executes-selected-semantic-subgraph", executesSelectedSemanticSubgraph as CapabilityBody],
  ["chains-semantic-results", chainsSemanticResults as CapabilityBody],
  ["explains-semantic-execution", explainsSemanticExecution as CapabilityBody],
  ["projects-semantic-proof", projectsSemanticProof as CapabilityBody],
  ["derives-conformance-vector-candidates", derivesConformanceVectorCandidates as CapabilityBody],
  ["verifies-conformance-vector", verifiesConformanceVector as CapabilityBody],
  ["resolves-kernel-compatibility", resolvesKernelCompatibility as CapabilityBody],
  ["projects-language-delegation-shell", projectsLanguageDelegationShell as CapabilityBody],
  ["applies-semantic-projection", appliesSemanticProjection as CapabilityBody],
]);

export function listsImplementedCapabilities(): readonly string[] {
  return Object.freeze([...runtimeFactories.keys()].sort());
}

export function createsCapabilityRuntimeById(capabilityId: string): CapabilityRuntime {
  const factory = runtimeFactories.get(capabilityId);
  const raise = (): never => {
    throw new Error(`No implemented capability runtime is registered for: ${capabilityId}`);
  };
  return factory === undefined ? raise() : factory();
}

export function readsCapabilityBody(capabilityId: string): CapabilityBody {
  const body = capabilityBodies.get(capabilityId);
  const raise = (): never => {
    throw new Error(`No runtime body is registered for: ${capabilityId}`);
  };
  return body === undefined ? raise() : body;
}

/**
 * Invokes a capability through its runtime body and declared edges, which is
 * the path a doorway takes.
 */
export async function invokesCapability(capabilityId: string, request: unknown): Promise<JsonObject> {
  const runtime = createsCapabilityRuntimeById(capabilityId);
  const body = readsCapabilityBody(capabilityId);
  return await body({ edges: runtime.edges, request }) as JsonObject;
}
