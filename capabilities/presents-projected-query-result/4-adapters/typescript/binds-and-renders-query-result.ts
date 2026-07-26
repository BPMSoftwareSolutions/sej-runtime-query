import { SemanticKernelError, type JsonObject, type JsonValue } from "@deterministic-solutions/semantic-kernel";

export type LayoutContentBinding = Readonly<{
  bindingId: string;
  acceptsContractId: string;
  layoutShapeId: string;
  regionBindings: readonly Readonly<{
    regionId: string;
    content: readonly BindingContent[];
  }>[];
}>;

type BindingContent =
  | Readonly<{ kind: "constant"; label: string; value: JsonValue }>
  | Readonly<{ kind: "field"; label: string; path: string }>
  | Readonly<{ kind: "collection"; label: string; path: string; itemPath: string }>;

export type SemanticPresentationModel = Readonly<{
  presentationModelType: "semantic-presentation-model.v1";
  resultContractId: string;
  layoutShapeId: string;
  bindingId: string;
  regions: readonly Readonly<{
    regionId: string;
    content: readonly Readonly<{
      kind: "constant" | "field" | "collection";
      label: string;
      value: JsonValue;
    }>[];
  }>[];
}>;

export function bindsProjectedResultToLayout(
  resultContractId: string,
  value: JsonValue,
  binding: LayoutContentBinding,
): SemanticPresentationModel {
  if (binding.acceptsContractId !== resultContractId) {
    throw new SemanticKernelError("PRESENTATION_BINDING_CONTRACT_MISMATCH", "Binding does not accept the projected result contract.");
  }
  return Object.freeze({
    presentationModelType: "semantic-presentation-model.v1",
    resultContractId,
    layoutShapeId: binding.layoutShapeId,
    bindingId: binding.bindingId,
    regions: Object.freeze(binding.regionBindings.map((region) => Object.freeze({
      regionId: region.regionId,
      content: Object.freeze(region.content.map((content) => Object.freeze({
        kind: content.kind,
        label: content.label,
        value: resolvesBindingValue(value, content),
      }))),
    }))),
  });
}

export function rendersTerminalPresentation(model: SemanticPresentationModel): string {
  return model.regions
    .flatMap((region) => region.content.flatMap((content) => rendersContent(content)))
    .filter((line) => line.length > 0)
    .join("\n");
}

export function rendersCanonicalJson(value: JsonValue): string {
  return JSON.stringify(value, null, 2);
}

function resolvesBindingValue(value: JsonValue, content: BindingContent): JsonValue {
  if (content.kind === "constant") return content.value;
  const resolved = readsPath(value, content.path);
  if (content.kind === "field") return resolved ?? null;
  if (!Array.isArray(resolved)) {
    throw new SemanticKernelError("PRESENTATION_COLLECTION_REQUIRED", `Binding path must resolve to an array: ${content.path}`);
  }
  return resolved.map((item) => readsPath(item, content.itemPath) ?? null);
}

function rendersContent(content: SemanticPresentationModel["regions"][number]["content"][number]): readonly string[] {
  if (content.kind === "constant") return [String(content.value).toUpperCase()];
  if (content.kind === "field") return [`${content.label}: ${String(content.value)}`];
  const values = Array.isArray(content.value) ? content.value : [];
  return [content.label.toUpperCase(), ...values.map((value) => `- ${String(value)}`)];
}

function readsPath(value: JsonValue, path: string): JsonValue | undefined {
  const segments = path.replace(/^\$\.?/, "").split(".").filter(Boolean);
  let current: JsonValue | undefined = value;
  for (const segment of segments) {
    if (!isJsonObject(current)) return undefined;
    current = current[segment];
  }
  return current;
}

function isJsonObject(value: JsonValue | undefined): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
