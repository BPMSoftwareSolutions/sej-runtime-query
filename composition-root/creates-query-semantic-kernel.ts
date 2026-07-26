import { createSemanticKernel } from "@deterministic-solutions/semantic-kernel";
import type { SemanticKernel } from "@deterministic-solutions/semantic-kernel";
import type { QueryKernelOptions } from "./types/query-kernel-options.type.js";

export function createsQuerySemanticKernel(context: QueryKernelOptions): SemanticKernel {
  return createSemanticKernel(context.kernelOptions);
}
