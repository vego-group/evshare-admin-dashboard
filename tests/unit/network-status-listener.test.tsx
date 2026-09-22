import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import NetworkStatusListener from "@/provider/network-status-listener";

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value,
  });
}

describe("NetworkStatusListener", () => {
  beforeEach(() => {
    setOnline(true);
  });

  it("shows an Arabic full-page message when the browser goes offline", () => {
    render(<NetworkStatusListener />);

    act(() => window.dispatchEvent(new Event("offline")));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("أنت غير متصل بالإنترنت")).toBeInTheDocument();
    expect(
      screen.getByText("تحقق من اتصالك بالشبكة أو الإنترنت."),
    ).toBeInTheDocument();
  });

  it("shows the message immediately when the app starts offline", () => {
    setOnline(false);
    render(<NetworkStatusListener />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("removes the offline screen after connectivity returns", () => {
    render(<NetworkStatusListener />);

    act(() => window.dispatchEvent(new Event("offline")));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    act(() => window.dispatchEvent(new Event("online")));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
