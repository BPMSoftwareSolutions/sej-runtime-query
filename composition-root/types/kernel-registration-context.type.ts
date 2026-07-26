import type { SemanticKernel } from "@deterministic-solutions/semantic-kernel";

export type KernelRegistrationContext = Readonly<{
  kernel: SemanticKernel;
  capabilityPacks: readonly unknown[];
}>;
