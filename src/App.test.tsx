import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the mission select page at root", async () => {
    render(<App />);
    expect(
      await screen.findByText("Mission Select"),
    ).toBeInTheDocument();
  });
});
