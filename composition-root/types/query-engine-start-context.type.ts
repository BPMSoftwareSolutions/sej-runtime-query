import type { SemanticKernelOptions } from "@deterministic-solutions/semantic-kernel";

export type QueryEngineStartContext = Readonly<{
  kernelOptions?: SemanticKernelOptions;
  capabilityPacks: readonly unknown[];
  portAdapters: Readonly<Record<string, unknown>>;
}>;
