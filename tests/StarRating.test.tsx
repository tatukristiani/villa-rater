import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StarRating from "../src/components/StarRating";

describe("StarRating", () => {
  it("renders correct number of stars", () => {
    render(<StarRating value={0} onChange={() => {}} />);
    const stars = screen.getAllByRole("button", { hidden: true });
    expect(stars).toHaveLength(5);
  });

  it("displays the current rating value", () => {
    render(<StarRating value={3.5} onChange={() => {}} />);
    expect(screen.getByText("3.5")).toBeInTheDocument();
  });

  it("calls onChange when star is clicked", async () => {
    const handleChange = vi.fn();
    render(<StarRating value={0} onChange={handleChange} />);

    const stars = screen.getAllByRole("button", { hidden: true });
    await userEvent.click(stars[2]);

    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it("does not call onChange when disabled", async () => {
    const handleChange = vi.fn();
    render(<StarRating value={2} onChange={handleChange} disabled />);

    const stars = screen.getAllByRole("button", { hidden: true });
    await userEvent.click(stars[3]);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("handles keyboard navigation", () => {
    const handleChange = vi.fn();
    render(<StarRating value={2.5} onChange={handleChange} />);

    const slider = screen.getByRole("slider");

    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(handleChange).toHaveBeenCalledWith(3);

    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(handleChange).toHaveBeenCalledWith(2);

    fireEvent.keyDown(slider, { key: "Home" });
    expect(handleChange).toHaveBeenCalledWith(0);

    fireEvent.keyDown(slider, { key: "End" });
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it("handles number key presses", () => {
    const handleChange = vi.fn();
    render(<StarRating value={0} onChange={handleChange} />);

    const slider = screen.getByRole("slider");

    fireEvent.keyDown(slider, { key: "3" });
    expect(handleChange).toHaveBeenCalledWith(3);

    fireEvent.keyDown(slider, { key: "5" });
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it("has correct ARIA attributes", () => {
    render(<StarRating value={3.5} onChange={() => {}} />);

    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-label", "Rating");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "5");
    expect(slider).toHaveAttribute("aria-valuenow", "3.5");
    expect(slider).toHaveAttribute("aria-disabled", "false");
  });

  it("sets aria-disabled when disabled", () => {
    render(<StarRating value={2} onChange={() => {}} disabled />);

    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-disabled", "true");
    expect(slider).toHaveAttribute("tabIndex", "-1");
  });
});
