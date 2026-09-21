import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const nodeRequire = createRequire(import.meta.url);
const testDirectory = path.dirname(fileURLToPath(import.meta.url));

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

const apiErrors = load("src/lib/utils/api-error.ts");
const currency = load("src/constants/currency.ts");
const money = load("src/lib/utils/money.ts", {
  "@/constants/currency": currency,
});

test("API behavior branches on stable error code fields", () => {
  assert.equal(
    apiErrors.getApiErrorCode({ code: "OTP_EXPIRED", message: "localized" }),
    "OTP_EXPIRED",
  );
  assert.equal(
    apiErrors.getApiErrorCode({ error_code: "AUTH_TOKEN_REVOKED" }),
    "AUTH_TOKEN_REVOKED",
  );
  assert.equal(apiErrors.getRetryAfterSeconds({ retry_after_seconds: "17" }), 17);
  assert.deepEqual(
    apiErrors.getRequiredPermissions({ details: { required: ["Admin Cancel Trips", 3] } }),
    ["Admin Cancel Trips"],
  );
});

test("launch currencies use their contract minor units", () => {
  assert.match(money.formatPrice(12, undefined, {}, "SAR"), /12\.00 SAR$/);
  assert.match(money.formatPrice(12, undefined, {}, "JOD"), /12\.000 JOD$/);
  assert.match(money.formatPrice(12.4, undefined, {}, "SYP"), /12 SYP$/);
});

test("sensitive UI actions use split permissions", () => {
  const files = {
    locks: fs.readFileSync(path.join(testDirectory, "..", "src/components/panel/vehicle-operating-pricing/modals/command-panel-modal.tsx"), "utf8"),
    payouts: fs.readFileSync(path.join(testDirectory, "..", "src/components/panel/payment-requests/details-panel/request-details-footer.tsx"), "utf8"),
    companies: fs.readFileSync(path.join(testDirectory, "..", "src/components/panel/operating-companies/results/operating-company-result-parts.tsx"), "utf8"),
  };

  assert.match(files.locks, /ADMIN_PERMISSIONS\.locks\.assign/);
  assert.match(files.locks, /ADMIN_PERMISSIONS\.locks\.unassign/);
  assert.match(files.payouts, /ADMIN_PERMISSIONS\.paymentRequests\.reject/);
  assert.match(files.companies, /ADMIN_PERMISSIONS\.operationCompanies\.editCommission/);
});
