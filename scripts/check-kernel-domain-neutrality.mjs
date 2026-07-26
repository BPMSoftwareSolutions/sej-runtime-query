import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const kernelRoot = path.resolve(root, "..", "semantic-kernel");
const failures = [];
const forbiddenKernelFiles = [
  "src/contracts/relational.contract.ts",
  "src/kernel/relational-query-engine.ts",
];

for (const relative of forbiddenKernelFiles) {
  if (fs.existsSync(path.join(kernelRoot, relative))) {
    failures.push(`semantic kernel contains query-domain file: ${relative}`);
  }
}

const kernelIndex = fs.readFileSync(path.join(kernelRoot, "src", "index.ts"), "utf8");
if (/relational|sql/i.test(kernelIndex)) {
  failures.push("semantic kernel public index exports query-domain vocabulary");
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

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS kernel-domain-neutrality (relational authority and mechanics are query-owned)");
}
