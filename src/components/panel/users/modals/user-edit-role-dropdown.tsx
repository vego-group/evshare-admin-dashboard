import DashboardDropdown from "@/components/ui/dashboard-dropdown";
import type { Role } from "@/types";

type Props = {
  roles: Role[];
  value: string;
  currentRole?: { id: string; name: string };
  disabled?: boolean;
  isLoading?: boolean;
  onChange: (roleId: string) => void;
};

export default function UserEditRoleDropdown({
  roles,
  value,
  currentRole,
  disabled,
  isLoading,
  onChange,
}: Props) {
  const options = roles.map((role) => ({ value: role.id, label: role.name }));
  if (currentRole && !options.some((option) => option.value === currentRole.id)) {
    options.unshift({ value: currentRole.id, label: currentRole.name });
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
