import type { InvokeQueryContext } from "../../composition-root/types/invoke-query-context.type.js";

export async function invokesQuery(context: InvokeQueryContext): Promise<unknown> {
  return context.engine.invoke(context.request);
}
