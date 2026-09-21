import type { UserRole } from "./users";

export type AuthResponse = {
  data: {
    access_token: string;
    mobile_verified: boolean;
    expires_at: string;
    kyc_verified: boolean;
    kyc_status: "not_verified" | "pending" | "verified";
    last_kyc: unknown | null;
    tenant: {
      id: string;
      code: string;
    };
    user_data: {
      id: string;
      name: string;
      mobile: string;
      role: UserRole;
      permissions: string[];
    };
  };
};
