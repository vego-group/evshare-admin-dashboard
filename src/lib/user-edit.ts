import type { EditUserPayload } from "@/services/mutations/users";

export type UserEditValues = {
  first_name: string;
  last_name: string;
  email: string;
  city_id: string;
  role: string;
  active: boolean;
  language: "ar" | "en";
  notifications_enabled: boolean;
};

type UserEditError = {
  message?: string;
  error_code?: string;
};

const editableFields = [
  "first_name",
  "last_name",
  "email",
  "city_id",
  "role",
  "active",
  "language",
  "notifications_enabled",
] as const satisfies ReadonlyArray<keyof UserEditValues>;

/** Builds the partial body expected by POST /users/{uuid}/edit. */
export function buildEditUserPayload(
  original: UserEditValues,
  values: UserEditValues,
): EditUserPayload {
  const payload: EditUserPayload = {};

  for (const field of editableFields) {
    if (values[field] === original[field]) continue;

    switch (field) {
      case "email":
      case "city_id":
        payload[field] = values[field] || null;
        break;
      case "active":
      case "notifications_enabled":
        payload[field] = values[field];
        break;
      case "language":
        payload[field] = values[field];
        break;
      default:
        payload[field] = values[field];
    }
  }

  return payload;
}

/** Converts the role-policy errors shared by edit and role assignment into actionable UI copy. */
export function getUserEditErrorMessage(
  error: UserEditError | undefined,
  fallback: string,
) {
  switch (error?.error_code) {
    case "SELF_ROLE_CHANGE_FORBIDDEN":
      return "لا يمكنك تغيير دورك الخاص";
    case "ROLE_ESCALATION_FORBIDDEN":
      return "لا تملك صلاحية تعيين هذا الدور أو تغيير دور هذا المستخدم";
    case "INVALID_ACCOUNT_TRANSITION":
      return "لا يمكن تعديل دور حساب محذوف";
    default:
      return error?.message || fallback;
  }
}
