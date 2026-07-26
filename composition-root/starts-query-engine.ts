import { createsQuerySemanticKernel } from "./creates-query-semantic-kernel.js";
import { registersCapabilityPacks } from "./registers-capability-packs.js";
import { seatsPortAdapters } from "./seats-port-adapters.js";
import type { QueryEngineStartContext } from "./types/query-engine-start-context.type.js";
import type { QueryEngineStartResult } from "./types/query-engine-start-result.type.js";

export function startsQueryEngine(context: QueryEngineStartContext): QueryEngineStartResult {
  const kernel = createsQuerySemanticKernel({ kernelOptions: context.kernelOptions });
  const registered = registersCapabilityPacks({ kernel, capabilityPacks: context.capabilityPacks });
  const seated = seatsPortAdapters({ kernel: registered.kernel, portAdapters: context.portAdapters });
  const engine = Object.freeze({
    edges: seated.kernel.edges,
    invoke: (request: unknown) => seated.kernel.edges.invokes("routes-semantic-command", Object.freeze({ edges: seated.kernel.edges, request })),
  });
  return Object.freeze({ engine });
}
