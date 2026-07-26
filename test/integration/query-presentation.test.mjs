import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  createsQueryResultPresentationRuntime,
  startsQueryEngine,
} from "../../dist/composition-root/exports-query-library.js";
import { createsJsonSchemaValidator } from "../../dist/capabilities/applies-semantic-projection/4-adapters/typescript/validates-json-schema.js";

test("executes relational query, semantic projection, automatic layout resolution, binding, and terminal rendering", async () => {
  const { engine } = startsQueryEngine({ capabilityPacks: [], portAdapters: {} });
  const receipt = await engine.invoke({
    requestType: "executes-relational-query-request.v1",
    requestId: "workspace-report",
    payload: {
      commandText:
        "SELECT relativePath, sejClassification FROM registry APPLY RESULT PROJECTION project-workspace-capability-report",
      sources: {
        registry: [
          {
            relativePath: "capabilities/layout-shaper.json",
            sejClassification: "sej",
          },
          {
            relativePath: "README.md",
            sejClassification: "non-sej",
          },
        ],
      },
    },
  });

  assert.equal(receipt.resultType, "projected-presented-query-result.v1");
  assert.equal(receipt.disposition, "QUERY_RESULT_PRESENTED");
  assert.equal(receipt.relationalReceipt.disposition, "RELATIONAL_QUERY_EXECUTED");
  assert.equal(receipt.projectionReceipt.disposition, "QUERY_RESULT_PROJECTED");
  assert.equal(receipt.projectionReceipt.outputContractId, "workspace-capability-report.v1");
  assert.equal(receipt.presentationReceipt.disposition, "QUERY_RESULT_PRESENTED");
  assert.equal(
    receipt.presentationReceipt.layoutShapeId,
    "workspace-capability-report.v1::workspace-capability-report-terminal",
  );
  assert.equal(receipt.presentationReceipt.bindingId, "bind-workspace-capability-report.v1");
  assert.match(receipt.rendered, /WORKSPACE CAPABILITY REPORT/);
  assert.match(receipt.rendered, /Capabilities: 1/);
  assert.match(receipt.rendered, /- capabilities\/layout-shaper\.json/);
});

test("returns canonical JSON when no promoted layout applies", async () => {
  const presentation = createsQueryResultPresentationRuntime();
  const receipt = await presentation.present({
    requestType: "presents-projected-query-result-request.v1",
    requestId: "fallback-presentation",
    surface: "terminal",
    projectionReceipt: {
      disposition: "QUERY_RESULT_PROJECTED",
      outputContractId: "unregistered-semantic-result.v1",
      projectedResult: {
        projectedResultType: "projected-query-result.v1",
        projectionId: "project-unregistered",
        scope: "complete-result",
        value: { answer: 42 },
        inputRowCount: 1,
        projectedRowCount: 1,
        rejectedRowCount: 0,
        diagnostics: [],
      },
    },
  });

  assert.equal(receipt.disposition, "CANONICAL_JSON_RETURNED");
  assert.equal(receipt.layoutShapeId, null);
  assert.equal(receipt.bindingId, null);
  assert.equal(receipt.presentationModel, null);
  assert.equal(receipt.fallbackDisposition, "no-applicable-promoted-layout");
  assert.equal(receipt.rendered, JSON.stringify({ answer: 42 }, null, 2));
});

test("rejects a presentation request that violates its public input contract", async () => {
  const presentation = createsQueryResultPresentationRuntime();

  await assert.rejects(
    () => presentation.present({
      requestId: "missing-contract-fields",
      projectionReceipt: {
        disposition: "QUERY_RESULT_PROJECTED",
        outputContractId: "unregistered-semantic-result.v1",
        projectedResult: { value: { answer: 42 } },
      },
    }),
    (error) => error?.code === "INPUT_CONTRACT_INVALID",
  );
});

test("rejects presentation receipts whose disposition contradicts their authority fields", () => {
  const receiptSchema = JSON.parse(fs.readFileSync(
    "capabilities/presents-projected-query-result/contracts/query-result-presentation-receipt.schema.v1.json",
    "utf8",
  ));
  const presentationModelSchema = JSON.parse(fs.readFileSync(
    "capabilities/presents-projected-query-result/contracts/semantic-presentation-model.schema.v1.json",
    "utf8",
  ));
  const validator = createsJsonSchemaValidator([presentationModelSchema]);
  const validation = validator.validate(receiptSchema, {
    receiptType: "query-result-presentation-receipt.v1",
    runId: "contradictory-receipt",
    capabilityId: "presents-projected-query-result",
    authorityHash: `sha256:${"a".repeat(64)}`,
    inputHash: `sha256:${"b".repeat(64)}`,
    resultHash: `sha256:${"c".repeat(64)}`,
    disposition: "QUERY_RESULT_PRESENTED",
    resultContractId: "example-result.v1",
    surface: "terminal",
    layoutShapeId: "example-layout",
    bindingId: "example-binding",
    presentationModel: {
      presentationModelType: "semantic-presentation-model.v1",
      resultContractId: "example-result.v1",
      layoutShapeId: "example-layout",
      bindingId: "example-binding",
      regions: [],
    },
    rendered: "example",
    fallbackDisposition: "no-applicable-promoted-layout",
    findings: [],
  });

  assert.equal(validation.valid, false);
});
