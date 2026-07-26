/**
 * Records proof expectations from live capability execution.
 *
 * Expectations are recorded, never hand-written, so a recorded expectation can
 * only ever describe what the capability actually produced. Recording is a
 * deliberate developer action: `npm test` compares against these files and
 * fails on any drift.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { invokesCapability, listsImplementedCapabilities } from "../dist/composition-root/creates-capability-registry.js";

const root = process.cwd();
const written = [];

for (const capabilityId of listsImplementedCapabilities()) {
  for (const kind of ["accepts", "rejects"]) {
    const fixture = path.join(root, "capabilities", capabilityId, "proof", "fixtures", `${capabilityId}.${kind}.input.json`);
    const expectation = path.join(root, "capabilities", capabilityId, "proof", "expectations", `${capabilityId}.${kind}.expected.json`);
    const request = JSON.parse(fs.readFileSync(fixture, "utf8"));
    const receipt = await invokesCapability(capabilityId, request);

    /**
     * Hashes are recorded so drift is caught, but the recorded expectation is
     * the full receipt: disposition, resolved rule, findings, and result.
     */
    fs.mkdirSync(path.dirname(expectation), { recursive: true });
    fs.writeFileSync(expectation, `${JSON.stringify(receipt, null, 2)}\n`);
    written.push(path.relative(root, expectation));
  }
}

console.log(`Recorded ${written.length} capability expectations.`);
