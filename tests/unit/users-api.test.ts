import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({
  baseAPI: vi.fn(),
}));

vi.mock("@/services", () => serviceMocks);

import { usersAPI, usersStatisticsAPI } from "@/services/queries/users";

describe("users API contract", () => {
  beforeEach(() => {
    serviceMocks.baseAPI.mockReset();
    serviceMocks.baseAPI.mockResolvedValue({ data: [] });
  });

  it("maps the Users Management filters to the documented query parameters", async () => {
    await usersAPI({
      page: 2,
      per_page: 25,
      role: "merchant",
      status: "active",
      subscription_status: "subscribed",
      sort_by: "created_at",
      sort_order: "asc",
      search: "Ahmed Ali",
    });

    expect(serviceMocks.baseAPI).toHaveBeenCalledWith(
      "GET",
      "/users?page=2&per_page=25&role=merchant&status=active&subscription_status=subscribed&sort_by=created_at&sort_order=asc&search=Ahmed+Ali",
    );
  });

  it("keeps legacy callers compatible while sending the current API contract", async () => {
    await usersAPI({
      page: 1,
      limit: 100,
      account_status: "suspended",
      order_by: "desc",
    });

    expect(serviceMocks.baseAPI).toHaveBeenCalledWith(
      "GET",
      "/users?page=1&per_page=100&status=suspended&sort_by=created_at&sort_order=desc",
    );
  });

  it("loads dashboard cards, role distribution, and role options from statistics", async () => {
    await usersStatisticsAPI();

    expect(serviceMocks.baseAPI).toHaveBeenCalledWith("GET", "/users/statistics");
  });
});
