import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import {
  permissionCategorySchema,
  permissionSchema,
  roleEditSchema,
  type PermissionCategoryFormInput,
  type PermissionFormInput,
  type RoleEditFormValues,
} from "@/schemas/roles-permissions";

type Issue = { path: PropertyKey[]; code: string; message: string };

function errorsFrom<T extends FieldValues>(issues: Issue[]) {
  const errors: FieldErrors<T> = {};
  for (const issue of issues) {
    const field = issue.path[0] as keyof T | undefined;
    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message } as FieldErrors<T>[keyof T];
    }
  }
  return errors;
}

export const roleFormResolver: Resolver<RoleEditFormValues> = async (values) => {
  const result = roleEditSchema.safeParse(values);
  return result.success ? { values: result.data, errors: {} } : { values: {}, errors: errorsFrom<RoleEditFormValues>(result.error.issues) };
};

export const permissionFormResolver: Resolver<PermissionFormInput> = async (values) => {
  const result = permissionSchema.safeParse(values);
  return result.success ? { values, errors: {} } : { values: {}, errors: errorsFrom<PermissionFormInput>(result.error.issues) };
};

export const categoryFormResolver: Resolver<PermissionCategoryFormInput> = async (values) => {
  const result = permissionCategorySchema.safeParse(values);
  return result.success ? { values, errors: {} } : { values: {}, errors: errorsFrom<PermissionCategoryFormInput>(result.error.issues) };
};
