import type { RegisterCapabilityPacksResult } from "./types/register-capability-packs-result.type.js";
import type { KernelRegistrationContext } from "./types/kernel-registration-context.type.js";

export function registersCapabilityPacks(
  context: KernelRegistrationContext,
): RegisterCapabilityPacksResult {
  context.kernel.registerCapabilityPacks(context.capabilityPacks);
  return Object.freeze({ kernel: context.kernel });
}
