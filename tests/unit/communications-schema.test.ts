import { describe, expect, it } from "vitest";

import { communicationSchema } from "@/schemas/communications";

const base = {
  title: "New offer",
  notification_body: "Open the app to see the offer",
  sms_body: "",
  channels: ["push"] as const,
};

describe("communication schema", () => {
  it("accepts independent all and specific application targets", () => {
    const result = communicationSchema.safeParse({
      ...base,
      targets: [
        { application: "merchant", selection_type: "all", user_ids: [] },
        { application: "rider", selection_type: "specific", user_ids: ["rider-1", "rider-2"] },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("requires at least one id for a specific target", () => {
    const result = communicationSchema.safeParse({
      ...base,
      targets: [{ application: "rider", selection_type: "specific", user_ids: [] }],
    });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.path).toEqual(["targets", 0, "user_ids"]);
  });
});
