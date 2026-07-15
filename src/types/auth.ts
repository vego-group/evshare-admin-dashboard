import type { UserRole } from "./users";

export type AuthResponse = {
  data: {
    access_token: string;
    mobile_verified: boolean;
    expires_at: string;
    kyc_verified: boolean;
    kyc_status: "not_verified" | "pending" | "verified";
    user_data: {
      id: string;
      name: string;
      mobile: number;
      role: UserRole;
    };
  };
};
