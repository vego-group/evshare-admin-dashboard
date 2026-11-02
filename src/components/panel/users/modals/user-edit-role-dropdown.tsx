import DashboardDropdown from "@/components/ui/dashboard-dropdown";
import type { Role } from "@/types";

type Props = {
  roles: Role[];
  value: string;
  currentRole?: { id: string; name: string };
  valueMode?: "id" | "name";
  disabled?: boolean;
  isLoading?: boolean;
  onChange: (roleId: string) => void;
};

export default function UserEditRoleDropdown({
  roles,
  value,
  currentRole,
  valueMode = "id",
  disabled,
  isLoading,
  onChange,
}: Props) {
  const getValue = (role: { id: string; name: string }) =>
    valueMode === "name" ? role.name : role.id;
  const options = roles.map((role) => ({ value: getValue(role), label: role.name }));
  if (currentRole && !options.some((option) => option.value === getValue(currentRole))) {
    options.unshift({ value: getValue(currentRole), label: currentRole.name });
  }

  return (
    <DashboardDropdown
      id="user-role-id"
      value={value}
      options={options}
      onChange={onChange}
      placeholder="اختر الدور"
      ariaLabel="الأدوار"
      emptyLabel="لا توجد أدوار متاحة"
      loadingLabel="جاري تحميل الأدوار..."
      disabled={disabled}
      isLoading={isLoading}
      placement="top"
      className="flex-1"
    />
  );
}
