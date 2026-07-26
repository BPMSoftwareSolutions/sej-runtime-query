import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const capabilitiesRoot = path.join(root, "capabilities");

for (const capability of fs.readdirSync(capabilitiesRoot)) {
  const featurePath = path.join(capabilitiesRoot, capability, "features", `${capability}.feature`);
  const bodyRoot = path.join(capabilitiesRoot, capability, "runtime", "typescript", "bodies");
  const feature = fs.readFileSync(featurePath, "utf8");
  const scenarioCount = (feature.match(/^\s*Scenario(?: Outline)?:/gm) || []).length;
  const bodies = fs.readdirSync(bodyRoot).filter((file) => file.endsWith(".ts"));
  if (scenarioCount !== 1) failures.push(`${capability} must declare exactly one scenario or scenario outline; observed ${scenarioCount}`);
  if (bodies.length !== 1) failures.push(`${capability} must declare exactly one runtime body; observed ${bodies.length}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS one-scenario-one-body");
}
