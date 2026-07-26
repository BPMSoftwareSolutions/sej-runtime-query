/**
 * Guards against conditional logic disguised to evade the body-shape gate, and
 * against authored domain decisionality below the projection boundary.
 *
 * This gate exists because a previous implementation replaced forbidden `if`
 * statements with `(condition ? doThing : noop)()` — syntactically legal,
 * semantically identical, and invisible to a gate that only greps for `if`.
 * Optimizing for the gate instead of the discipline is itself the violation.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

/**
 * Patterns that express a branch without using a branching keyword. These are
 * forbidden everywhere below the projection boundary — kernel, adapter, and
 * capability body alike — because the standard grants none of them decisionality.
 */
const disguisedConditionals = [
  ["immediately-invoked conditional callable", /\(\s*[\w.]+\s*\?\s*[\w.]+\s*:\s*[\w.]+\s*\)\s*\(/],
  ["noop branch sink", /\bnoop\b\s*[,)]|=>\s*undefined\s*;?\s*$/m],
  ["conditional side-effect dispatch", /\(\s*[\w.]+\s*\?\s*\(\s*\)\s*=>/],
  ["short-circuit side effect", /^\s*[\w.]+\s*&&\s*[\w.]+\(/m],
];

/**
 * Severity words that indicate a defect/classification vocabulary is being
 * assigned in code. Severity and disposition vocabularies are semantic
 * authority; code may read them from a declaration but never author them.
 */
const authoredClassification = [
  ["authored severity literal", /severity\s*:\s*["'](?:blocking|advisory|fatal|warning)["']/],
  ["authored disposition literal", /disposition\s*:\s*["'](?:reject|approve|authorize)[\w-]*["']/],
];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(candidate) : [candidate];
  });
}

const executableRoots = ["capabilities", "composition-root", "doorways"];
const sources = executableRoots
  .flatMap((directory) => walk(path.join(root, directory)))
  .filter((file) => file.endsWith(".ts") && !file.endsWith(".type.ts"));

for (const file of sources) {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  for (const [name, pattern] of [...disguisedConditionals, ...authoredClassification]) {
    if (pattern.test(text)) failures.push(`${relative} contains ${name}`);
  }
}

/**
 * Array mutation is on the standard's prohibited list. Accumulating results by
 * pushing into a mutable array hides both ordering and inclusion policy.
 */
for (const file of sources) {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  if (/\.push\s*\(/.test(text)) failures.push(`${relative} mutates an array with push`);
  if (/\blet\s+\w+\s*=/.test(text)) failures.push(`${relative} declares mutable state with let`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`PASS no-disguised-decisionality (${sources.length} executable sources)`);
}
