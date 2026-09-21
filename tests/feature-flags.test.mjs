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

function response(overrides = {}) {
  return {
    error: false,
    message: "",
    data: {
      feature_flags: [
        { id: "1", key: "new-dashboard", name: "New dashboard", name_ar: "لوحة جديدة", name_en: "New dashboard", is_enabled: true, enabled: true },
        { id: "2", key: "legacy-export", name: "Legacy export", name_ar: "تصدير قديم", name_en: "Legacy export", is_enabled: false, enabled: false },
      ],
      config_version: 42,
      config_published_at: "2026-09-21T11:59:55.000Z",
      evaluated_at: "2026-09-21T11:59:58.000Z",
      evaluation_context: { audience: "admin", platform: "web", version_code: 1 },
      ...overrides,
    },
  };
}

const context = { applicationVersion: 1 };

test("uses evaluated enable and disable values", () => {
  const evaluation = parseFeatureFlagEvaluation(response(), context);
  assert.equal(isFeatureEnabled(evaluation, "new-dashboard", false), true);
  assert.equal(isFeatureEnabled(evaluation, "legacy-export", true), false);
});

test("missing flags use the caller's explicit safe default", () => {
  const evaluation = parseFeatureFlagEvaluation(response(), context);
  assert.equal(isFeatureEnabled(evaluation, "missing"), false);
  assert.equal(isFeatureEnabled(evaluation, "missing", true), true);
});

test("audience, platform, and app-version mismatches are rejected", () => {
  for (const overrides of [
    { evaluation_context: { audience: "merchant", platform: "web", version_code: 1 } },
    { evaluation_context: { audience: "admin", platform: "ios", version_code: 1 } },
    { evaluation_context: { audience: "admin", platform: "web", version_code: 2 } },
  ]) {
    assert.equal(parseFeatureFlagEvaluation(response(overrides), context), null);
  }
});

test("malformed and non-boolean payloads fail closed", () => {
  assert.equal(parseFeatureFlagEvaluation({ data: null }, context), null);
  assert.equal(
    parseFeatureFlagEvaluation(response({ feature_flags: [{ id: "1", key: "unsafe", name: "Unsafe", name_ar: "غير آمن", name_en: "Unsafe", is_enabled: true, enabled: "true" }] }), context),
    null,
  );
});

test("rollback replaces the complete configuration atomically", () => {
  const enabled = parseFeatureFlagEvaluation(response(), context);
  const rollback = parseFeatureFlagEvaluation(
    response({
      config_version: 43,
      feature_flags: [
        { id: "1", key: "new-dashboard", name: "New dashboard", name_ar: "لوحة جديدة", name_en: "New dashboard", is_enabled: false, enabled: false },
        { id: "2", key: "legacy-export", name: "Legacy export", name_ar: "تصدير قديم", name_en: "Legacy export", is_enabled: true, enabled: true },
      ],
    }),
    context,
  );

  assert.equal(isFeatureEnabled(enabled, "new-dashboard", false), true);
  assert.equal(isFeatureEnabled(rollback, "new-dashboard", false), false);
  assert.deepEqual(rollback.flags, {
    "new-dashboard": false,
    "legacy-export": true,
  });
});
