import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import MissionSelectPage from "./features/mission-select/MissionSelectPage";

describe("MissionSelectPage", () => {
  it("renders the title and mission cards", () => {
    render(
      <MemoryRouter>
        <MissionSelectPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Cosmosyy")).toBeInTheDocument();
    expect(screen.getByText("Apollo 11")).toBeInTheDocument();
    expect(screen.getByText("Sea of Tranquility")).toBeInTheDocument();
  });
});
