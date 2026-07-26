import type { QueryEngine } from "./query-engine.type.js";

export type InvokeQueryContext = Readonly<{
  engine: QueryEngine;
  request: unknown;
}>;
