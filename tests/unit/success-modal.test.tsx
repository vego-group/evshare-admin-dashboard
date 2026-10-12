import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import SuccessModalHost, {
  showSuccessModal,
} from "@/components/ui/success-modal";
import Modal from "@/components/ui/modal";

describe("SuccessModalHost", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows successful dashboard actions in a modal", () => {
    render(<SuccessModalHost />);

    act(() => {
      showSuccessModal("Action completed");
      vi.runOnlyPendingTimers();
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Action completed")).toBeInTheDocument();
  });

  it("queues success messages instead of dropping overlapping actions", () => {
    render(<SuccessModalHost />);

    act(() => {
      showSuccessModal("First action");
      showSuccessModal("Second action");
      vi.runOnlyPendingTimers();
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
    expect(screen.queryByText("Form content")).not.toBeInTheDocument();
    expect(screen.queryByText("Item updated")).not.toBeInTheDocument();

    act(() => vi.runOnlyPendingTimers());

    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(screen.getByText("Item updated")).toBeInTheDocument();
  });

  it("closes every open dashboard modal before mounting one success modal", () => {
    render(
      <>
        <Modal open onClose={vi.fn()} title="First modal">
          First modal content
        </Modal>
        <Modal open onClose={vi.fn()} title="Second modal">
          Second modal content
        </Modal>
        <SuccessModalHost />
      </>,
    );

    act(() => showSuccessModal("All changes saved"));

    expect(screen.queryByText("First modal content")).not.toBeInTheDocument();
    expect(screen.queryByText("Second modal content")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("dialog")).toHaveLength(0);

    act(() => vi.runOnlyPendingTimers());

    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(screen.getByText("All changes saved")).toBeInTheDocument();
  });

  it("uses the green success treatment for the confirmation icon", () => {
    render(<SuccessModalHost />);

    act(() => {
      showSuccessModal("Saved");
      vi.runOnlyPendingTimers();
    });

    expect(document.querySelector(".lucide-circle-check-big")?.parentElement)
      .toHaveClass("bg-emerald-600", "text-white");
  });
});
