import type { SemanticKernelOptions } from "@deterministic-solutions/semantic-kernel";

export type QueryKernelOptions = Readonly<{
  kernelOptions?: SemanticKernelOptions;
}>;
