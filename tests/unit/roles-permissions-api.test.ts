import { beforeEach, describe, expect, it, vi } from "vitest";

import { roleEditSchema, roleSchema } from "@/schemas/roles-permissions";
import {
  permissionCategoriesAPI,
  permissionsAPI,
} from "@/services/queries/roles-permissions";

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

describe("roles and permissions API contracts", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("never includes allowed_user in role create or edit payloads", () => {
    const unsafeInput = { name: "operations", allowed_user: true };

    expect(roleSchema.parse(unsafeInput)).toEqual({ name: "operations" });
    expect(roleEditSchema.parse(unsafeInput)).toEqual({ name: "operations" });
  });

  it("accepts an optional source role and strips legacy permission input", () => {
    const sourceRoleId = "3f0a8e2c-5b6d-4c1e-9a7f-2d4b6c8e0a1b";

    expect(roleSchema.parse({
      name: "Sales Supervisor",
      source_role_id: sourceRoleId,
      permissions: ["Admin Index Orders"],
    })).toEqual({ name: "Sales Supervisor", source_role_id: sourceRoleId });
    expect(roleSchema.parse({ name: "Auditor", source_role_id: "" }))
      .toEqual({ name: "Auditor", source_role_id: undefined });
  });

  it("rejects an invalid source role id and role names over 255 characters", () => {
    expect(roleSchema.safeParse({ name: "Auditor", source_role_id: "role-1" }).success)
      .toBe(false);
    expect(roleSchema.safeParse({ name: "a".repeat(256) }).success).toBe(false);
  });

  it("passes permission search and pagination to the server", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        error: false,
        message: "",
        data: [],
        meta: { currentPage: 2, lastPage: 2, perPage: 10, total: 14 },
      }),
    );

    const result = await permissionsAPI({
      page: 2,
      limit: 10,
      search: "export",
      order_by: "asc",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/permissions?page=2&limit=10&search=export&order_by=asc",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result.meta).toEqual({
      currentPage: 2,
      lastPage: 2,
      perPage: 10,
      total: 14,
    });
  });

  it("preserves permission categories and an empty matching result", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        error: false,
        message: "",
        data: [
          {
            id: "permission-1",
            name: "Admin Export Users",
            slug: "Admin Export Users",
            name_ar: "تصدير المستخدمين",
            name_en: "Export Users",
            permission_category_id: "category-1",
            permission_category: {
              id: "category-1",
              name: "Users",
              name_ar: "المستخدمون",
              name_en: "Users",
            },
            dashboard_permissions: true,
            created_at: "2026-10-11",
            updated_at: "2026-10-11",
          },
        ],
        meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 1 },
      }),
    );

    const categorized = await permissionsAPI({ page: 1, limit: 10 });
    expect(categorized.data[0].permission_category).toEqual({
      id: "category-1",
      name: "Users",
      name_ar: "المستخدمون",
      name_en: "Users",
    });

    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        error: false,
        message: "",
        data: [],
        meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 0 },
      }),
    );

    const empty = await permissionsAPI({ page: 1, limit: 10, search: "missing" });
    expect(empty.data).toEqual([]);
    expect(empty.meta.total).toBe(0);
  });

  it("normalizes the nested permission-category paginator envelope", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        error: false,
        message: "",
        data: {
          data: [
            {
              id: "category-1",
              name: "Marketing Communications",
              name_ar: "الرسائل التسويقية",
              name_en: "Marketing Communications",
              slug: "communications",
              created_at: "2026-10-07",
              updated_at: "2026-10-12",
            },
          ],
          meta: {
            current_page: 1,
            last_page: 3,
            per_page: 10,
            total: 27,
          },
        },
      }),
    );

    const result = await permissionCategoriesAPI({ page: 1, limit: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toMatchObject({
      name: "Marketing Communications",
      slug: "communications",
    });
    expect(result.meta).toEqual({
      currentPage: 1,
      lastPage: 3,
      perPage: 10,
      total: 27,
    });
  });
});
