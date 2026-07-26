import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const capabilitiesRoot = path.join(root, "capabilities");
const failures = [];
const bodyContract = readsJson(path.join(root, "architecture", "query-engine.body.contract.v1.json"));
const declaredCapabilities = new Map(bodyContract.capabilities.map((entry) => [entry.capabilityId, entry]));
const capabilityDirectories = fs.readdirSync(capabilitiesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const capabilityId of capabilityDirectories) {
  const capabilityRoot = path.join(capabilitiesRoot, capabilityId);
  const requiredFiles = [
    `intent/${capabilityId}.intent-ir.v1.json`,
    `features/${capabilityId}.feature`,
    `contracts/${capabilityId}.input.schema.v1.json`,
    `contracts/${capabilityId}.result.schema.v1.json`,
    `contracts/${capabilityId}.receipt.schema.v1.json`,
    `1-semantic-authority/${capabilityId}.capability.sej.v1.json`,
    `runtime/typescript/bodies/${capabilityId}.ts`,
    `docs/${capabilityId}.md`,
  ];
  for (const relative of requiredFiles) {
    if (!fs.existsSync(path.join(capabilityRoot, relative))) failures.push(`${capabilityId} is missing ${relative}`);
  }
  const registrations = fs.readdirSync(path.join(capabilityRoot, "runtime", "typescript", "registration"))
    .filter((file) => file.endsWith(".ts"));
  if (registrations.length !== 1) failures.push(`${capabilityId} must contain exactly one TypeScript authority registration; observed ${registrations.length}`);
  for (const relative of [
    "1-semantic-authority/decisions",
    "1-semantic-authority/policies",
    "1-semantic-authority/ports",
    "1-semantic-authority/proof-requirements",
    "2-semantic-projections",
    "3-semantic-execution-models",
    "conformance",
  ]) {
    const directory = path.join(capabilityRoot, relative);
    const files = fs.existsSync(directory) ? fs.readdirSync(directory).filter((file) => file.endsWith(".json")) : [];
    if (files.length === 0) failures.push(`${capabilityId} has no JSON authority in ${relative}`);
  }

  const authority = readsJson(path.join(capabilityRoot, "1-semantic-authority", `${capabilityId}.capability.sej.v1.json`));
  const contractEntry = declaredCapabilities.get(capabilityId);
  if (contractEntry === undefined) failures.push(`${capabilityId} is absent from the file-system body contract`);
  if (contractEntry?.status !== authority.status) {
    failures.push(`${capabilityId} status differs between body contract (${String(contractEntry?.status)}) and authority (${String(authority.status)})`);
  }

  const vectors = fs.readdirSync(path.join(capabilityRoot, "conformance"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => readsJson(path.join(capabilityRoot, "conformance", file)));
  if (authority.status === "implemented") {
    if (authority.promotionDisposition !== "conformance-passed") {
      failures.push(`${capabilityId} is implemented without conformance-passed promotion`);
    }
    if (vectors.some((vector) => vector.status !== "accepted" || vector.kernelExecution !== "passed")) {
      failures.push(`${capabilityId} is implemented without accepted, kernel-passed conformance vectors`);
    }
    for (const proofDirectory of ["proof/fixtures", "proof/expectations"]) {
      const files = fs.readdirSync(path.join(capabilityRoot, proofDirectory)).filter((file) => file.endsWith(".json"));
      if (files.length === 0) failures.push(`${capabilityId} is implemented without ${proofDirectory} evidence`);
    }
  } else if (authority.status === "drafted") {
    if (vectors.some((vector) => vector.status === "accepted" || vector.kernelExecution === "passed")) {
      failures.push(`${capabilityId} is drafted but claims accepted or kernel-passed conformance`);
    }
  } else {
    failures.push(`${capabilityId} declares unsupported promotion status: ${String(authority.status)}`);
  }
}

for (const capabilityId of declaredCapabilities.keys()) {
  if (!capabilityDirectories.includes(capabilityId)) failures.push(`Body contract declares missing capability directory: ${capabilityId}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  const implemented = capabilityDirectories.filter((capabilityId) => declaredCapabilities.get(capabilityId)?.status === "implemented").length;
  console.log(`PASS capability-promotion (${implemented} implemented, ${capabilityDirectories.length - implemented} explicitly drafted)`);
}

function readsJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
