import { appliesSemanticProjection } from "../capabilities/applies-semantic-projection/runtime/typescript/bodies/applies-semantic-projection.js";
import {
  registersSemanticProjectionAuthority,
  type SemanticProjectionRuntimeOptions,
} from "../capabilities/applies-semantic-projection/runtime/typescript/registration/registers-semantic-projection-authority.js";
import { createsQuerySemanticKernel } from "./creates-query-semantic-kernel.js";

export type SemanticProjectionCapability = Readonly<{
  apply(request: unknown): Promise<unknown>;
}>;

export function createsSemanticProjectionCapability(
  options: SemanticProjectionRuntimeOptions,
): SemanticProjectionCapability {
  const kernel = createsQuerySemanticKernel({});
  const edges = registersSemanticProjectionAuthority(kernel, options);
  return Object.freeze({
    apply: (request: unknown) => appliesSemanticProjection(Object.freeze({ edges, request })),
  });
}
