import { spawnSync } from "node:child_process";

const checks = [
  "scripts/check-capability-body-shape.mjs",
  "scripts/check-no-disguised-decisionality.mjs",
  "scripts/check-authority-language-neutrality.mjs",
  "scripts/check-one-scenario-one-body.mjs",
  "scripts/check-port-boundaries.mjs",
  "scripts/check-receipt-completeness.mjs",
  "scripts/check-json-artifacts.mjs",
  "scripts/check-capability-promotion.mjs",
  "scripts/check-workspace-registry-scaffold.mjs",
  "scripts/project-json-schema-types.mjs --check",
  "scripts/check-kernel-domain-neutrality.mjs",
];

let failed = false;
for (const check of checks) {
  const [script, ...argumentsList] = check.split(" ");
  const result = spawnSync(process.execPath, [script, ...argumentsList], { stdio: "inherit" });
  failed = failed || result.status !== 0;
}
process.exitCode = failed ? 1 : 0;
