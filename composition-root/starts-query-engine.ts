import { createsQuerySemanticKernel } from "./creates-query-semantic-kernel.js";
import { registersCapabilityPacks } from "./registers-capability-packs.js";
import { seatsPortAdapters } from "./seats-port-adapters.js";
import type { QueryEngineStartContext } from "./types/query-engine-start-context.type.js";
import type { QueryEngineStartResult } from "./types/query-engine-start-result.type.js";
import { createsExecutesRelationalQueryRuntime } from "../capabilities/executes-relational-query/runtime/typescript/registration/registers-executes-relational-query-authority.js";
import { executesRelationalQuery } from "../capabilities/executes-relational-query/runtime/typescript/bodies/executes-relational-query.js";
import { SemanticKernelError, type DecisionDeclaration, type JsonValue } from "@deterministic-solutions/semantic-kernel";
import routeDecision from "./semantic-authority/routes-query-execution.sej.v1.json" with { type: "json" };
import { createsProjectedPresentedQueryExecution } from "./presentation/executes-projected-presented-query.js";

export function startsQueryEngine(context: QueryEngineStartContext): QueryEngineStartResult {
  const kernel = createsQuerySemanticKernel(
    context.kernelOptions === undefined ? {} : { kernelOptions: context.kernelOptions },
  );
  const registered = registersCapabilityPacks({ kernel, capabilityPacks: context.capabilityPacks });
  const seated = seatsPortAdapters({ kernel: registered.kernel, portAdapters: context.portAdapters });
  seated.kernel.catalog.registerDecision(routeDecision as DecisionDeclaration);
  const relational = createsExecutesRelationalQueryRuntime();
  const invokesRelational = (request: unknown) =>
    executesRelationalQuery(Object.freeze({ edges: relational.edges, request }));
  const invokesPresented = createsProjectedPresentedQueryExecution(invokesRelational);
  const routes: Readonly<Record<string, (request: unknown) => Promise<unknown>>> = Object.freeze({
    "execute-relational-query": invokesRelational,
    "execute-projected-presented-query": invokesPresented,
  });
  const engine = Object.freeze({
    edges: seated.kernel.edges,
    invoke: (request: unknown) => {
      const route = seated.kernel.resolve("routes-query-execution", request as JsonValue);
      const execution = routes[String(route)];
      if (execution === undefined) {
        throw new SemanticKernelError("QUERY_EXECUTION_ROUTE_UNSUPPORTED", `Unsupported query execution route: ${String(route)}`);
      }
      return execution(request);
    },
  });
  return Object.freeze({ engine });
}
