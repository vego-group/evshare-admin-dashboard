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

test("suspend and reactivate use the documented endpoints and bodies", async () => {
  const calls = [];
  const mutations = load("src/services/mutations/users.ts", {
    "..": {
      safeApi: async (...args) => {
        calls.push(args);
        return { ok: true, status: 200, data: {} };
      },
    },
  });

  await mutations.suspendUser("user-1", "Chargeback review");
  await mutations.suspendUser("user-2");
  await mutations.reactivateUser("user-3");

  assert.deepEqual(calls, [
    ["POST", "/users/user-1/suspend", { reason: "Chargeback review" }],
    ["POST", "/users/user-2/suspend", {}],
    ["POST", "/users/user-3/reactivate"],
  ]);
});

test("a persisted status change updates detail and list caches before refetch", async () => {
  const { syncUserMutationResponse } = load("src/lib/user-query-cache.ts");
  const queryClient = createFakeQueryClient([
    [["users", { page: 1, limit: 10 }], usersResponse([user("user-1", "active")])],
    [["users", { page: 1, limit: 10, account_status: "active" }], usersResponse([user("user-1", "active")])],
  ]);
  const response = { error: false, message: "ok", data: user("user-1", "suspended") };

  await syncUserMutationResponse(queryClient, response);

  assert.deepEqual(queryClient.read(["user", "user-1"]), response);
  assert.equal(
    queryClient.read(["users", { page: 1, limit: 10 }]).data[0].account_status,
    "suspended",
  );
  const activePage = queryClient.read([
    "users",
    { page: 1, limit: 10, account_status: "active" },
  ]);
  assert.deepEqual(activePage.data, []);
  assert.equal(activePage.meta.total, 0);
  assert.deepEqual(queryClient.invalidations, [["users"]]);
});

function user(id, accountStatus) {
  return {
    id,
    name: "Test User",
    mobile: "+966500000000",
    email: null,
    active: accountStatus === "active",
    account_status: accountStatus,
    role: "driver",
    mobile_verified: true,
    mobile_verified_at: null,
    created_at: "2026-01-01T00:00:00Z",
  };
}

function usersResponse(data) {
  return {
    error: false,
    message: "ok",
    data,
    meta: { currentPage: 1, lastPage: 1, perPage: 10, total: data.length },
  };
}

function createFakeQueryClient(initialEntries) {
  const entries = new Map(initialEntries.map(([key, value]) => [JSON.stringify(key), { key, value }]));
  const invalidations = [];

  return {
    invalidations,
    read(key) {
      return entries.get(JSON.stringify(key))?.value;
    },
    getQueriesData({ queryKey }) {
      return [...entries.values()]
        .filter((entry) => queryKey.every((part, index) => entry.key[index] === part))
        .map((entry) => [entry.key, entry.value]);
    },
    setQueryData(key, next) {
      const serialized = JSON.stringify(key);
      const current = entries.get(serialized)?.value;
      entries.set(serialized, {
        key,
        value: typeof next === "function" ? next(current) : next,
      });
    },
    async invalidateQueries({ queryKey }) {
      invalidations.push(queryKey);
    },
  };
}
