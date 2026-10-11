import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({ baseAPI: vi.fn() }));
vi.mock("@/services", () => serviceMocks);

import { communicationRecipientsAPI } from "@/services/queries/communications";

describe("communications recipients API contract", () => {
  beforeEach(() => {
    serviceMocks.baseAPI.mockReset();
    serviceMocks.baseAPI.mockResolvedValue({ data: [] });
  });

  it("sends application, search, and pagination parameters", async () => {
    await communicationRecipientsAPI({ application: "rider", search: "Ahmed Ali", page: 2, per_page: 20 });

    expect(serviceMocks.baseAPI).toHaveBeenCalledWith(
      "GET",
      "/communications/recipients?application=rider&page=2&per_page=20&search=Ahmed+Ali",
    );
  });

  it("encodes every requested recipient id using ids[]", async () => {
    await communicationRecipientsAPI({ application: "merchant", ids: ["user-1", "user-2"], page: 1, per_page: 10 });

    expect(serviceMocks.baseAPI).toHaveBeenCalledWith(
      "GET",
      "/communications/recipients?application=merchant&page=1&per_page=10&ids%5B%5D=user-1&ids%5B%5D=user-2",
    );
  });
});
