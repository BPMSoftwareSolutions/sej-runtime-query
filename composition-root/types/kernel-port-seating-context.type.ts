import type { SemanticKernel } from "@deterministic-solutions/semantic-kernel";

export type KernelPortSeatingContext = Readonly<{
  kernel: SemanticKernel;
  portAdapters: Readonly<Record<string, unknown>>;
}>;
