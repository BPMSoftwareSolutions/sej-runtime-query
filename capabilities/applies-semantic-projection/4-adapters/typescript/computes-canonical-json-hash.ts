import { createHash } from "node:crypto";

export function computesCanonicalJsonHash(value: unknown): string {
  const canonical = JSON.stringify(canonicalizesJsonValue(value));
  return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
}

function canonicalizesJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalizesJsonValue);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, canonicalizesJsonValue(entry)]),
    );
  }
  return value;
}
