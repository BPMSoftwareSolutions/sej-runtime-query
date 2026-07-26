export type QueryEngineStartContext = Readonly<{
  kernelOptions?: unknown;
  capabilityPacks: readonly unknown[];
  portAdapters: Readonly<Record<string, unknown>>;
}>;
