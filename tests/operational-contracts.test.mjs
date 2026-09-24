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

test("device command responses normalize the documented camelCase contract", () => {
  const { normalizeVehicleDeviceCommand } = load("src/lib/utils/device-command.ts");
  const command = normalizeVehicleDeviceCommand({
    commandId: "command-1",
    correlationId: "trace-1",
    type: "unlock",
    status: "acknowledged",
    physical_action_confirmed: true,
    acceptedAt: "2026-09-20T10:00:00Z",
    acknowledgedAt: "2026-09-20T10:00:03Z",
    providerCommandId: "provider-1",
  });

  assert.equal(command.command_id, "command-1");
  assert.equal(command.correlation_id, "trace-1");
  assert.equal(command.physical_action_confirmed, true);
  assert.equal(command.provider_command_id, "provider-1");
});

test("trip operations send reason and idempotency in the documented body", async () => {
  const calls = [];
  const mutations = load("src/services/mutations/trips.ts", {
    "..": { safeApi: async (...args) => { calls.push(args); return { ok: true }; } },
  });

  await mutations.endTripAPI("trip-1", "key-1", "Support request");
  await mutations.cancelTripAPI("trip-2", "key-2", "Customer request");

  assert.deepEqual(calls, [
    ["POST", "/trips/trip-1/end", { reason: "Support request", idempotencyKey: "key-1" }, { headers: { "Idempotency-Key": "key-1" } }],
    ["POST", "/trips/trip-2/cancel", { reason: "Customer request", idempotencyKey: "key-2" }, { headers: { "Idempotency-Key": "key-2" } }],
  ]);
});

test("vehicle control uses the synchronous command endpoint and payload", async () => {
  const calls = [];
  const mutations = load("src/services/mutations/vehicle-operating-pricing.ts", {
    "..": { safeApi: async (...args) => { calls.push(args); return { ok: true }; } },
  });

  await mutations.sendVehicleCommandAPI("vehicle-1", {
    command: "sound_alarm",
    params: { duration: 5 },
  });

  assert.deepEqual(calls[0], [
    "POST",
    "/vehicles/vehicle-1/command",
    { command: "sound_alarm", params: { duration: 5 } },
  ]);
});

test("assigned lock controls address the lock resource directly", async () => {
  const calls = [];
  const mutations = load("src/services/mutations/vehicle-operating-pricing.ts", {
    "..": { safeApi: async (...args) => { calls.push(args); return { ok: true }; } },
  });

  await mutations.lockVehicleLockAPI("lock-1");
  await mutations.unlockVehicleLockAPI("lock-1");
  await mutations.locateVehicleLockAPI("lock-1");

  assert.deepEqual(calls, [
    ["POST", "/locks/lock-1/lock"],
    ["POST", "/locks/lock-1/unlock"],
    ["POST", "/locks/lock-1/locate"],
  ]);
});

test("feature flag mutations use the supplied add, delete, and rollback endpoints", async () => {
  const calls = [];
  const mutations = load("src/services/mutations/feature-flags.ts", {
    "..": { safeApi: async (...args) => { calls.push(args); return { ok: true }; } },
  });

  await mutations.addFeatureFlag({ key: "flag", name_ar: "علم", name_en: "Flag", is_active: false });
  await mutations.deleteFeatureFlag("flag-id");
  await mutations.rollbackFeatureFlag("flag-id", 2);

  assert.deepEqual(calls.map((call) => call.slice(0, 3)), [
    ["POST", "/feature-flags/add", { key: "flag", name_ar: "علم", name_en: "Flag", is_active: false }],
    ["DELETE", "/feature-flags/flag-id/delete"],
    ["POST", "/feature-flags/flag-id/rollback", { version: 2 }],
  ]);
});

test("settings catalog validates each value by its documented type", () => {
  const { validateSettingValue } = load("src/lib/settings-catalog.ts");
  const setting = (setting_name) => ({ setting_name });

  assert.equal(validateSettingValue(setting("currency_code"), "JOD"), null);
  assert.match(validateSettingValue(setting("currency_code"), "BTC"), /الخيارات/);
  assert.equal(validateSettingValue(setting("maintenance_mode"), "1"), null);
  assert.match(validateSettingValue(setting("currency_minor_units"), "2.5"), /صحيح/);
  assert.match(validateSettingValue(setting("vat_value"), "101"), /تتجاوز/);
  assert.equal(validateSettingValue(setting("wallet_suggested_top_up_amounts"), "50,100,200"), null);
});

test("high-risk service modules contain the versioned contract endpoints", () => {
  const read = (file) => fs.readFileSync(path.join(testDirectory, "..", file), "utf8");
  assert.match(read("src/services/mutations/vehicle-operating-pricing.ts"), /\/vehicles\/\$\{vehicleId\}\/command`/);
  assert.match(read("src/services/mutations/refunds.ts"), /\/refunds\/request/);
  assert.match(read("src/services/mutations/pricing-configuration.ts"), /\/pricing-config\/rollback/);
  assert.match(read("src/services/mutations/pages.ts"), /\/pages\/\$\{uuid\}\/publish/);
  assert.match(read("src/services/mutations/sliders.ts"), /\/slides\/\$\{sliderId\}\/rollback/);
});
