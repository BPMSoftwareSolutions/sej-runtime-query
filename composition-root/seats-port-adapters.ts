import type { KernelPortSeatingContext } from "./types/kernel-port-seating-context.type.js";
import type { SeatPortAdaptersResult } from "./types/seat-port-adapters-result.type.js";

export function seatsPortAdapters(
  context: KernelPortSeatingContext,
): SeatPortAdaptersResult {
  context.kernel.seatPortAdapters(context.portAdapters);
  return Object.freeze({ kernel: context.kernel });
}
