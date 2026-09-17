import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const nodeRequire = createRequire(import.meta.url);
const testDirectory = path.dirname(fileURLToPath(import.meta.url));

// Load the actual TypeScript helpers without adding a test runner to the app.
function load(sourcePath, dependencies = {}) {
  const source = fs.readFileSync(path.join(testDirectory, "..", sourcePath), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const compiledModule = { exports: {} };
  const localRequire = (id) => dependencies[id] ?? nodeRequire(id);
  new Function("require", "module", "exports", output)(localRequire, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}

const countries = load("src/data/countries.ts");
const { normalizeTenantPhone, displayTenantPhone } = load("src/lib/utils/tenant-phone.ts", {
  "@/data/countries": countries,
});
const { formatStoredPhone, normalizePhoneForLink } = load("src/lib/utils/format-phone.ts", {
  "./tenant-phone": { normalizeTenantPhone },
  "@/data/countries": countries,
});

for (const [country, national, trunk, e164] of [
  ["sa", "512345678", "0512345678", "+966512345678"],
  ["jo", "791234567", "0791234567", "+962791234567"],
  ["sy", "933123456", "0933123456", "+963933123456"],
]) {
  test(`${country}: local and international forms have one duplicate-check key`, () => {
    for (const input of [national, trunk, e164, e164.slice(1), `00${e164.slice(1)}`]) {
      assert.equal(normalizeTenantPhone(input, country), e164);
    }
    assert.equal(displayTenantPhone(trunk, country), e164);
  });

  test(`${country}: invalid or cross-tenant mobiles are rejected`, () => {
    for (const input of ["", "12345", "+441234567890", "555abc123", "++966512345678"]) {
      assert.equal(normalizeTenantPhone(input, country), null);
    }
  });
}

test("unknown tenant fails closed and legacy display stays unchanged", () => {
  assert.equal(normalizeTenantPhone("512345678", "xx"), null);
  assert.equal(displayTenantPhone("not a phone", "sa"), "not a phone");
  assert.equal(formatStoredPhone("791234567"), "791234567");
  assert.equal(formatStoredPhone("791234567", "jo"), "+962791234567");
  assert.equal(normalizePhoneForLink("791234567"), "791234567");
  assert.equal(formatStoredPhone("962791234567"), "+962791234567");
  assert.equal(normalizeTenantPhone("962567450057", "jo"), null);
  assert.equal(formatStoredPhone("962567450057"), "+962567450057");
});
