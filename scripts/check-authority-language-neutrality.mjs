import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const neutralRoots = ["intent", "features", "contracts", "1-semantic-authority", "2-semantic-projections", "3-semantic-execution-models"];
const forbidden = [
  ["TypeScript", /\bTypeScript\b/i], ["JavaScript", /\bJavaScript\b/i], ["Node runtime", /\bNode(?:\.js)?\b/i],
  ["Python", /\bPython\b/], ["C sharp", /\bC#\b/], ["Java runtime", /\bJava\b/],
  ["runtime package", /@deterministic-solutions\/semantic-kernel/], ["source extension", /\.ts\b/], ["Promise", /\bPromise\b/],
];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(candidate) : [candidate];
  });
}

for (const capability of fs.readdirSync(path.join(root, "capabilities"))) {
  for (const neutralRoot of neutralRoots) {
    for (const file of walk(path.join(root, "capabilities", capability, neutralRoot))) {
      const text = fs.readFileSync(file, "utf8");
      for (const [name, pattern] of forbidden) {
        if (pattern.test(text)) failures.push(`${path.relative(root, file)} contains language contamination: ${name}`);
      }
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS authority-language-neutrality");
}
