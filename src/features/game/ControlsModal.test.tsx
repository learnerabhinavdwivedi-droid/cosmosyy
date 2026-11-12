import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ControlsModal } from "./ControlsModal";

describe("ControlsModal", () => {
  it("renders nothing when isOpen is false", () => {
    const onClose = vi.fn();
    render(<ControlsModal isOpen={false} onClose={onClose} />);
    expect(screen.queryByRole("heading", { name: /controls/i })).not.toBeInTheDocument();
  });

  it("renders controls modal content when isOpen is true", () => {
    const onClose = vi.fn();
    render(<ControlsModal isOpen={true} onClose={onClose} />);
    expect(screen.getByRole("heading", { name: /controls/i })).toBeInTheDocument();
    expect(screen.getByText("W")).toBeInTheDocument();
    expect(screen.getByText("Space")).toBeInTheDocument();
    expect(screen.getByText("Shift")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<ControlsModal isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<ControlsModal isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
