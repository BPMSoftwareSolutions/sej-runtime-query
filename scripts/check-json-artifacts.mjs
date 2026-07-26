import fs from "node:fs";
import path from "node:path";
import Ajv2020Module from "ajv/dist/2020.js";

const Ajv2020 = Ajv2020Module.default ?? Ajv2020Module;
const root = process.cwd();
const failures = [];
const artifactRoots = ["architecture", "capabilities", "examples", "kernel-compatibility", "migration"];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(candidate) : [candidate];
  });
}

const jsonFiles = artifactRoots
  .flatMap((directory) => walk(path.join(root, directory)))
  .filter((file) => file.endsWith(".json"));
const documents = new Map();

for (const file of jsonFiles) {
  try {
    documents.set(file, JSON.parse(fs.readFileSync(file, "utf8")));
  } catch (error) {
    failures.push(`${path.relative(root, file)} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const schemas = [...documents].filter(([file, document]) =>
  file.endsWith(".schema.v1.json") || document?.$schema !== undefined || document?.$ref !== undefined);
const ajv = new Ajv2020({ allErrors: true, strict: true });
ajv.addKeyword({ keyword: "x-canonicalReceiptSchema", schemaType: "string" });
ajv.addKeyword({ keyword: "x-scaffold-status", schemaType: "string" });
ajv.addKeyword({ keyword: "x-sej-presentation", schemaType: "object" });

for (const [file, schema] of schemas.filter(([, candidate]) => typeof candidate?.$id === "string")) {
  try {
    ajv.addSchema(schema);
  } catch (error) {
    failures.push(`${path.relative(root, file)} could not be registered as JSON Schema: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const [file, schema] of schemas) {
  try {
    ajv.compile(schema);
  } catch (error) {
    failures.push(`${path.relative(root, file)} is not a compilable JSON Schema: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const declarationIdentities = new Map();
const identityFields = new Map([
  ["semantic-capability.v1", "capabilityId"],
  ["decision.v1", "decisionId"],
  ["semantic-decision.v1", "decisionId"],
  ["projection.v1", "projectionId"],
  ["semantic-projection.v1", "projectionId"],
  ["semantic-execution-model.v1", "executionModelId"],
  ["iteration.v1", "iterationId"],
  ["semantic-iteration.v1", "iterationId"],
  ["semantic-policy.v1", "policyId"],
  ["semantic-port-catalog.v1", "portCatalogId"],
  ["semantic-proof-requirement.v1", "proofRequirementId"],
]);

for (const [file, document] of documents) {
  const identityField = identityFields.get(document?.declarationType);
  if (identityField === undefined) continue;
  const identity = document[identityField];
  if (typeof identity !== "string" || identity.length === 0) {
    failures.push(`${path.relative(root, file)} does not declare ${identityField}`);
    continue;
  }
  const compound = `${document.declarationType}:${identity}`;
  const existing = declarationIdentities.get(compound);
  if (existing !== undefined) {
    failures.push(`${path.relative(root, file)} duplicates ${compound} from ${path.relative(root, existing)}`);
  } else {
    declarationIdentities.set(compound, file);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`PASS json-artifacts (${jsonFiles.length} JSON documents, ${schemas.length} schemas)`);
}
