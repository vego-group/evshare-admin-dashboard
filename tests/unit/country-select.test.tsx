import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CountrySelect from "@/components/login/country-select";
import type { Country } from "@/types";

const countries = [
  { id: 1, code: "sa", name: "Saudi Arabia", name_ar: "السعودية", name_en: "Saudi Arabia", active: true },
  { id: 2, code: "jo", name: "Jordan", name_ar: "الأردن", name_en: "Jordan", active: false },
] as unknown as Country[];

describe("CountrySelect", () => {
  it("opens with listbox semantics and selects an active country", () => {
    const onChange = vi.fn();
    render(<CountrySelect countries={countries} value="" onChange={onChange} />);

    const trigger = screen.getByRole("button", { expanded: false });
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("option", { name: /السعودية/ }));

    expect(onChange).toHaveBeenCalledWith("sa");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not allow an inactive country", () => {
    const onChange = vi.fn();
    render(<CountrySelect countries={countries} value="" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { expanded: false }));

    expect(screen.getByRole("option", { name: /الأردن/ })).toBeDisabled();
    fireEvent.click(screen.getByRole("option", { name: /الأردن/ }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
