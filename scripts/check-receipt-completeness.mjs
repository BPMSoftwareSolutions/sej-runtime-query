import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const universal = ["receiptType", "runId", "capabilityId", "authorityHash", "inputHash", "resultHash", "disposition", "findings"];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(candidate) : [candidate];
  });
}

for (const file of walk(root).filter((file) => /receipt\.schema\.v1\.json$/.test(file))) {
  const schema = JSON.parse(fs.readFileSync(file, "utf8"));
  if (schema["x-canonicalReceiptSchema"]) continue;
  const required = new Set(schema.required || []);
  for (const field of universal) {
    if (!required.has(field)) failures.push(`${path.relative(root, file)} does not require ${field}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS receipt-completeness");
}
