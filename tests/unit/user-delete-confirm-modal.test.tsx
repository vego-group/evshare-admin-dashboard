import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import UserDeleteConfirmModal from "@/components/panel/users/modals/user-delete-confirm-modal";

describe("UserDeleteConfirmModal", () => {
  it("requires a removal reason that satisfies the API contract", () => {
    const onConfirm = vi.fn();
    render(
      <UserDeleteConfirmModal
        open
        userName="Test User"
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    const reason = screen.getByLabelText(/سبب الإزالة/);
    fireEvent.change(reason, { target: { value: " x " } });
    fireEvent.click(screen.getByRole("button", { name: "إزالة الحساب" }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("3 أحرف");
    expect(reason).toHaveAttribute("aria-invalid", "true");
  });

  it("trims the audit reason before confirming removal", () => {
    const onConfirm = vi.fn();
    render(
      <UserDeleteConfirmModal
        open
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.change(screen.getByLabelText(/سبب الإزالة/), {
      target: { value: "  Confirmed fraudulent activity  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "إزالة الحساب" }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onConfirm).toHaveBeenCalledWith("Confirmed fraudulent activity");
  });

  it("locks the form while the removal request is in progress", () => {
    render(
      <UserDeleteConfirmModal
        open
        isDeleting
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/سبب الإزالة/)).toBeDisabled();
    expect(screen.getByRole("button", { name: "إلغاء" })).toBeDisabled();
  });
});
