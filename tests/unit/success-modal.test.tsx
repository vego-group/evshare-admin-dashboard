import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SuccessModalHost, {
  showSuccessModal,
} from "@/components/ui/success-modal";
import Modal from "@/components/ui/modal";
import { vi } from "vitest";

describe("SuccessModalHost", () => {
  it("shows successful dashboard actions in a modal", () => {
    render(<SuccessModalHost />);

    act(() => showSuccessModal("Action completed"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Action completed")).toBeInTheDocument();
  });

  it("queues success messages instead of dropping overlapping actions", () => {
    render(<SuccessModalHost />);

    act(() => {
      showSuccessModal("First action");
      showSuccessModal("Second action");
    });

    expect(screen.getByText("First action")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "إغلاق" }));

    expect(screen.getByText("Second action")).toBeInTheDocument();
  });

  it("closes the action modal before showing its success confirmation", () => {
    const onClose = vi.fn();
    render(
      <>
        <Modal open onClose={onClose} title="Edit item">
          Form content
        </Modal>
        <SuccessModalHost />
      </>,
    );

    act(() => showSuccessModal("Item updated"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Item updated")).toBeInTheDocument();
  });
});
