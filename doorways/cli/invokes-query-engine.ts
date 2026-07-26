import type { QueryEngine } from "../../composition-root/types/query-engine.type.js";

export async function invokesQueryEngine(
  engine: QueryEngine,
  commandText: string,
  sources: Readonly<Record<string, readonly Readonly<Record<string, unknown>>[]>> = {},
): Promise<unknown> {
  return engine.invoke(Object.freeze({
    requestType: "executes-relational-query-request.v1",
    requestId: "operator-query",
    payload: Object.freeze({ commandText, sources }),
  }));
}
