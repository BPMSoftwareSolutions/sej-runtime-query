import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(candidate) : [candidate];
  });
}

for (const file of walk(path.join(root, "capabilities")).filter((file) => file.includes(`${path.sep}runtime${path.sep}typescript${path.sep}bodies${path.sep}`))) {
  const text = fs.readFileSync(file, "utf8");
  if (/4-adapters|node:fs|node:path|node:http|fetch\s*\(/.test(text)) failures.push(`${path.relative(root, file)} crosses the mechanical adapter boundary`);
}

for (const capability of fs.readdirSync(path.join(root, "capabilities"))) {
  const portRoot = path.join(root, "capabilities", capability, "1-semantic-authority", "ports");
  const ports = walk(portRoot).filter((file) => file.endsWith(".json"));
  if (ports.length === 0) failures.push(`${capability} does not declare a semantic port identity`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS port-boundaries");
}
