import { describe, expect, it } from "vitest";
import { authResponseSchema, loginSchema, verifyOtpSchema } from "@/schemas/login";

describe("authentication validation", () => {
  it("accepts an international mobile number", () => {
    expect(loginSchema.safeParse({ mobile: "+966512345678" }).success).toBe(true);
  });

  it.each(["", "123", "+966abc"])("rejects invalid login mobile %j", (mobile) => {
    expect(loginSchema.safeParse({ mobile }).success).toBe(false);
  });

  it("requires a six-digit OTP and a normalized mobile", () => {
    expect(verifyOtpSchema.safeParse({ mobile: "966512345678", otp: "123456" }).success).toBe(true);
    expect(verifyOtpSchema.safeParse({ mobile: "+966512345678", otp: "12345" }).success).toBe(false);
  });

  it("rejects expired or malformed authentication responses", () => {
    const response = {
      data: {
        access_token: "token",
        expires_at: "2020-01-01T00:00:00.000Z",
        tenant: { id: "tenant-1", code: "SA" },
        mobile_verified: true,
        kyc_verified: true,
        kyc_status: "verified",
        last_kyc: null,
        user_data: {
          id: "user-1",
          name: "Admin",
          mobile: "966512345678",
          role: "admin",
          permissions: [],
        },
      },
    };

    expect(authResponseSchema.safeParse(response).success).toBe(false);
  });
});
