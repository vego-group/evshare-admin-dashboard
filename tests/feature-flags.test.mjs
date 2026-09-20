import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const nodeRequire = createRequire(import.meta.url);
const testDirectory = path.dirname(fileURLToPath(import.meta.url));

function load(sourcePath) {
  const source = fs.readFileSync(path.join(testDirectory, "..", sourcePath), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const compiledModule = { exports: {} };
  new Function("require", "module", "exports", output)(
    nodeRequire,
    compiledModule,
    compiledModule.exports,
  );
  return compiledModule.exports;
}

const { parseFeatureFlagEvaluation, isFeatureEnabled } = load(
  "src/lib/utils/feature-flags.ts",
);

const now = Date.parse("2026-09-21T12:00:00.000Z");

function response(overrides = {}) {
  return {
    error: false,
    message: "",
    data: {
      application: "admin",
      platform: "web",
      application_version: "0.1.0",
      tenant: "sa",
      configuration_version: "42",
      published_at: "2026-09-21T11:59:55.000Z",
      evaluated_at: "2026-09-21T11:59:58.000Z",
      expires_at: "2026-09-21T12:01:00.000Z",
      flags: { "new-dashboard": true, "legacy-export": false },
      ...overrides,
    },
  };
}

const context = { tenant: "sa", applicationVersion: "0.1.0", now };

test("uses evaluated enable and disable values", () => {
  const evaluation = parseFeatureFlagEvaluation(response(), context);
  assert.equal(isFeatureEnabled(evaluation, "new-dashboard", false, now), true);
  assert.equal(isFeatureEnabled(evaluation, "legacy-export", true, now), false);
});

test("missing flags use the caller's explicit safe default", () => {
  const evaluation = parseFeatureFlagEvaluation(response(), context);
  assert.equal(isFeatureEnabled(evaluation, "missing"), false);
  assert.equal(isFeatureEnabled(evaluation, "missing", true), true);
});

test("expired cached evaluations fail closed", () => {
  const evaluation = parseFeatureFlagEvaluation(
    response({ expires_at: "2026-09-21T11:59:59.000Z" }),
    context,
  );
  assert.equal(evaluation, null);
  assert.equal(isFeatureEnabled(evaluation, "new-dashboard"), false);
});

test("tenant, application, platform, and app-version mismatches are rejected", () => {
  for (const overrides of [
    { tenant: "jo" },
    { application: "merchant" },
    { platform: "ios" },
    { application_version: "0.2.0" },
  ]) {
    assert.equal(parseFeatureFlagEvaluation(response(overrides), context), null);
  }
});

test("malformed and non-boolean payloads fail closed", () => {
  assert.equal(parseFeatureFlagEvaluation({ data: null }, context), null);
  assert.equal(
    parseFeatureFlagEvaluation(response({ flags: { unsafe: "true" } }), context),
    null,
  );
});

test("rollback replaces the complete configuration atomically", () => {
  const enabled = parseFeatureFlagEvaluation(response(), context);
  const rollback = parseFeatureFlagEvaluation(
    response({
      configuration_version: "43",
      flags: { "new-dashboard": false, "legacy-export": true },
    }),
    context,
  );

  assert.equal(isFeatureEnabled(enabled, "new-dashboard", false, now), true);
  assert.equal(isFeatureEnabled(rollback, "new-dashboard", false, now), false);
  assert.deepEqual(rollback.flags, {
    "new-dashboard": false,
    "legacy-export": true,
  });
});
