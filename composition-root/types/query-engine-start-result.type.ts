import type { QueryEngine } from "./query-engine.type.js";

export type QueryEngineStartResult = Readonly<{
  engine: QueryEngine;
}>;
