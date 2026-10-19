import { z } from "zod";

const requiredName = z
  .string()
  .trim()
  .min(3, "يجب ألا يقل الاسم عن 3 أحرف");
const roleName = requiredName.max(255, "يجب ألا يتجاوز الاسم 255 حرفًا");
const optionalText = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => value || undefined);
const optionalRoleId = z
  .union([
    z.literal(""),
    z.string().uuid("معرّف الدور المصدر غير صالح"),
  ])
  .optional()
  .transform((value) => value || undefined);

export const roleSchema = z.object({
  name: roleName,
  source_role_id: optionalRoleId,
});

export const roleEditSchema = z.object({ name: roleName });

export const permissionSchema = z.object({
  name: requiredName,
  name_ar: requiredName,
  name_en: requiredName,
  permission_category_id: optionalText,
  dashboard_permissions: z.boolean().default(false),
});

export const permissionCategorySchema = z.object({
  name: requiredName,
  name_ar: optionalText,
  name_en: optionalText,
  slug: z.string().trim().min(1, "المعرّف مطلوب"),
});

export const syncRolePermissionsSchema = z.object({
  permissions: z.array(z.string()),
});

export const assignPermissionCategorySchema = z.object({
  permission_category_id: z.string().uuid("معرّف التصنيف غير صالح"),
});

export type RoleFormInput = z.input<typeof roleSchema>;
export type RoleFormValues = z.output<typeof roleSchema>;
export type RoleEditFormValues = z.infer<typeof roleEditSchema>;
export type PermissionFormInput = z.input<typeof permissionSchema>;
export type PermissionFormValues = z.output<typeof permissionSchema>;
export type PermissionCategoryFormInput = z.input<typeof permissionCategorySchema>;
export type PermissionCategoryFormValues = z.output<typeof permissionCategorySchema>;
export type SyncRolePermissionsValues = z.infer<typeof syncRolePermissionsSchema>;
export type AssignPermissionCategoryValues = z.infer<typeof assignPermissionCategorySchema>;
