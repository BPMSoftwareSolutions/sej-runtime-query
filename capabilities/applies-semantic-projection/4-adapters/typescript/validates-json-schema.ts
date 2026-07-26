import { Ajv2020, type AnySchema, type ErrorObject } from "ajv/dist/2020.js";

export type JsonSchemaValidator = Readonly<{
  validate(schema: unknown, value: unknown): Readonly<{
    valid: boolean;
    findings: readonly unknown[];
  }>;
}>;

export type ValidateJsonSchemaRequest = Readonly<{
  validator: JsonSchemaValidator;
  schema: unknown;
  value: unknown;
}>;

export function validatesJsonSchema(
  request: ValidateJsonSchemaRequest,
): Readonly<{ valid: boolean; findings: readonly unknown[] }> {
  return request.validator.validate(request.schema, request.value);
}

export function createsJsonSchemaValidator(schemas: readonly unknown[] = []): JsonSchemaValidator {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  for (const schema of schemas) ajv.addSchema(requiresSchema(schema));
  return Object.freeze({
    validate: (schema: unknown, value: unknown) => {
      const validate = ajv.compile(requiresSchema(schema));
      const outcome = validate(value);
      if (typeof outcome !== "boolean") throw new TypeError("Asynchronous JSON Schemas are not supported.");
      return Object.freeze({
        valid: outcome,
        findings: Object.freeze((validate.errors ?? []).map(projectsFinding)),
      });
    },
  });
}

function requiresSchema(value: unknown): AnySchema {
  if (typeof value === "boolean") return value;
  if (value !== null && typeof value === "object" && !Array.isArray(value)) return value as AnySchema;
  throw new TypeError("JSON Schema must be an object or Boolean.");
}

function projectsFinding(error: ErrorObject): Readonly<Record<string, unknown>> {
  return Object.freeze({
    keyword: error.keyword,
    instancePath: error.instancePath,
    schemaPath: error.schemaPath,
    message: error.message ?? "schema validation failed",
    params: error.params,
  });
}
