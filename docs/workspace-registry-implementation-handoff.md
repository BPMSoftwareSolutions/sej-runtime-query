# Workspace Registry Implementation Handoff

The workspace-registry file body system is structurally complete and
intentionally unimplemented.

## Canonical scaffold source

- `architecture/workspace-registry-capability-family.scaffold.v1.json`
- `architecture/workspace-registry-capability-family.ascii.md`
- `governance/workspace-registry-scaffold.promotion-policy.v1.json`

## What the follow-on implementation owns

For each drafted capability:

1. Replace empty semantic observation inputs and outputs.
2. Author complete decision rules and failure classifications.
3. Author result and receipt projection expressions.
4. Complete iteration and execution authority.
5. Bind every port to closed input and output contracts.
6. Seat adapters containing mechanics only.
7. Add admitted success, rejection, mutation, and replay vectors.
8. Execute vectors through the external semantic kernel.
9. Record canonical receipts and hashes.
10. Promote only the capability whose evidence passes.

## What the follow-on implementation must not do

- Add domain decisions to the semantic kernel.
- Add branching, loops, fallback, retry, DTO construction, or direct effects to
  generated capability bodies.
- Copy the legacy scanner implementation and treat its code as canonical intent.
- Change a capability to `implemented` before its kernel-executed evidence exists.
- Register a drafted capability as a live public operation.

## Body reprojection

The TypeScript bodies are generated from each capability's semantic execution
model:

```powershell
npm run project:bodies
npm run check:projected-bodies
```

Edit the semantic execution model and reproject. Do not edit a generated body.

