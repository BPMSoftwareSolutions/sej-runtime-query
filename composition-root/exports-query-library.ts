import type { QueryLibraryContext } from "./types/query-library-context.type.js";
import type { QueryLibrary } from "./types/query-library.type.js";

export {
  createsSemanticProjectionCapability,
  type SemanticProjectionCapability,
} from "./creates-semantic-projection-capability.js";
export { startsQueryEngine } from "./starts-query-engine.js";
export {
  createsCapabilityRuntimeById,
  invokesCapability,
  listsImplementedCapabilities,
  readsCapabilityBody,
  type CapabilityBody,
} from "./creates-capability-registry.js";
export type { CapabilityRuntime } from "./shared/creates-capability-runtime.js";

export function exportsQueryLibrary(context: QueryLibraryContext): QueryLibrary {
  return Object.freeze({ query: (request: unknown) => context.engine.invoke(request) });
}
