import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const kernelRoot = path.resolve(root, "..", "semantic-kernel");
const failures = [];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(candidate) : [candidate];
  });
}

for (const surface of ["src", "dist"]) {
  const surfaceRoot = path.join(kernelRoot, surface);
  if (surface === "src" && !fs.existsSync(surfaceRoot)) {
    failures.push("semantic kernel source surface is unavailable");
  }
  for (const file of walk(surfaceRoot)) {
    if (/\b(?:relational|sql)\b/i.test(fs.readFileSync(file, "utf8"))) {
      failures.push(`semantic kernel ${surface} surface contains query-domain vocabulary: ${path.relative(kernelRoot, file)}`);
    }
  }
}

const capabilityRoot = path.join(root, "capabilities", "executes-relational-query");
for (const relative of [
  "contracts/relational-query-plan.schema.v1.json",
  "4-adapters/typescript/relational-query.contract.ts",
  "4-adapters/typescript/executes-relational-query-plan.ts",
]) {
  if (!fs.existsSync(path.join(capabilityRoot, relative))) {
    failures.push(`query capability does not own ${relative}`);
  }
}

const capabilityAuthority = JSON.parse(fs.readFileSync(
  path.join(capabilityRoot, "1-semantic-authority", "executes-relational-query.capability.sej.v1.json"),
  "utf8",
));
if (capabilityAuthority.requiredKernelPrimitives.some((primitive) => /relational|sql|query/i.test(primitive))) {
  failures.push("query capability declares a query-domain operation as a kernel primitive");
}

const adapter = fs.readFileSync(
  path.join(capabilityRoot, "4-adapters", "typescript", "interprets-relational-query.ts"),
  "utf8",
);
if (/type Relational.*from "@deterministic-solutions\/semantic-kernel"|executeRelationalQuery.*from "@deterministic-solutions\/semantic-kernel"/s.test(adapter)) {
  failures.push("query adapter imports relational vocabulary from the semantic kernel");
}

const portCatalog = JSON.parse(fs.readFileSync(
  path.join(capabilityRoot, "1-semantic-authority", "ports", "executes-relational-query.port.sej.v1.json"),
  "utf8",
));
const executionPort = portCatalog.ports.find((port) => port.portId === "executes-query-owned-relational-plan");
if (
  executionPort?.effect !== "execute"
  || executionPort?.inputContract !== "authorized-relational-query-execution.v1"
  || executionPort?.outputContract !== "relational-query-result.v1"
) {
  failures.push("query-owned relational execution port does not declare its operational contracts");
}

const registration = fs.readFileSync(
  path.join(capabilityRoot, "runtime", "typescript", "registration", "registers-executes-relational-query-authority.ts"),
  "utf8",
);
if (!/executionPort\s*:\s*\{[\s\S]*portId:\s*"executes-query-owned-relational-plan"/.test(registration)) {
  failures.push("query-owned relational execution port is declared but not bound by capability registration");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS kernel-domain-neutrality (kernel source/distribution clean; query port ownership bound)");
}
