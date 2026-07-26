import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const forbidden = [
  ["if", /\bif\s*\(/], ["switch", /\bswitch\s*\(/], ["for", /\bfor\s*\(/], ["while", /\bwhile\s*\(/],
  ["try", /\btry\b/], ["catch", /\bcatch\b/], ["ternary", /\?[^.:\n]+:/], ["null-fallback", /\?\?/], ["logical-fallback", /\|\|/],
  ["node-import", /from\s+["']node:/], ["adapter-import", /4-adapters/], ["direct-json-parse", /JSON\.parse\s*\(/],
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(candidate) : [candidate];
  });
}

const bodies = walk(path.join(root, "capabilities")).filter((file) => file.includes(`${path.sep}runtime${path.sep}typescript${path.sep}bodies${path.sep}`) && file.endsWith(".ts"));
for (const file of bodies) {
  const text = fs.readFileSync(file, "utf8");
  for (const [name, pattern] of forbidden) {
    if (pattern.test(text)) failures.push(`${path.relative(root, file)} contains forbidden ${name}`);
  }
  if (!text.includes(".invokes(")) failures.push(`${path.relative(root, file)} does not invoke semantic authority`);
  if (!text.includes(".projects(")) failures.push(`${path.relative(root, file)} does not project a semantic result`);
  const functionCount = (text.match(/export\s+async\s+function\s+/g) || []).length;
  if (functionCount !== 1) failures.push(`${path.relative(root, file)} must contain exactly one public async body`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`PASS capability-body-shape (${bodies.length} bodies)`);
}
