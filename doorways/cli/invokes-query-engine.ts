import type { QueryEngine } from "../../composition-root/types/query-engine.type.js";

export async function invokesQueryEngine(
  engine: QueryEngine,
  commandText: string,
): Promise<unknown> {
  return engine.invoke(Object.freeze({ requestType: "query-command-text.v1", commandText }));
}
