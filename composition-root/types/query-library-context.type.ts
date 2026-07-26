import type { QueryEngine } from "./query-engine.type.js";

export type QueryLibraryContext = Readonly<{
  engine: QueryEngine;
}>;
