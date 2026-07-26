import type { SemanticKernel } from "@deterministic-solutions/semantic-kernel";

export type RegisterCapabilityPacksResult = Readonly<{
  kernel: SemanticKernel;
}>;
