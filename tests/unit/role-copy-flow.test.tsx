import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RolesPanel from "@/components/panel/roles-permissions/roles/roles-panel";

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn().mockResolvedValue(undefined) }),
}));

vi.mock("@/hooks", () => ({
  useUserPermissions: () => ({
    hasPermission: () => true,
    hasAnyPermission: () => true,
  }),
}));

vi.mock("@/hooks/api", () => ({
  useDeleteRole: () => ({ isPending: false, mutateAsync: vi.fn() }),
  useRole: () => ({ data: undefined, isLoading: false, error: null }),
  useRoles: () => ({
    data: {
      data: [],
      meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 0 },
    },
    isLoading: false,
  }),
}));

vi.mock("@/components/ui/success-modal", () => ({ showSuccessModal: vi.fn() }));

vi.mock("@/components/panel/roles-permissions/shared/entity-toolbar", () => ({
  default: ({ onAdd }: { onAdd?: () => void }) => (
    <button type="button" onClick={onAdd}>add-role</button>
  ),
}));

vi.mock("@/components/panel/roles-permissions/shared/entity-table", () => ({
  default: () => null,
}));
vi.mock("@/components/panel/roles-permissions/shared/entity-pagination", () => ({
  default: () => null,
}));
vi.mock("@/components/panel/roles-permissions/shared/details-modal", () => ({
  default: () => null,
}));
vi.mock("@/components/panel/roles-permissions/shared/delete-modal", () => ({
  default: () => null,
}));

vi.mock("@/components/panel/roles-permissions/roles/role-form-modal", () => ({
  default: ({ onSaved }: { onSaved: (role: unknown) => void }) => (
    <button
      type="button"
      onClick={() => onSaved({
        id: "new-role-id",
        name: "Sales Supervisor",
        copied_from: { id: "sales-role-id", name: "Sales" },
      })}
    >
      create-role
    </button>
  ),
}));

vi.mock("@/components/panel/roles-permissions/roles/role-permissions-modal", () => ({
  default: ({
    role,
    creationSourceName,
  }: {
    role: { name: string };
    creationSourceName?: string | null;
  }) => <div>permissions:{role.name}:copied-from:{creationSourceName}</div>,
}));

describe("copy role creation flow", () => {
  it("opens the copied role in the permissions editor after creation", async () => {
    render(<RolesPanel />);

    fireEvent.click(screen.getByRole("button", { name: "add-role" }));
    fireEvent.click(screen.getByRole("button", { name: "create-role" }));

    expect(await screen.findByText(
      "permissions:Sales Supervisor:copied-from:Sales",
    )).toBeInTheDocument();
  });
});
