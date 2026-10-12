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
