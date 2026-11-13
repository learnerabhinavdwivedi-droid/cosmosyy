import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeAll } from "vitest";
import LandingPage from "./features/landing/LandingPage";
import MissionSelectPage from "./features/mission-select/MissionSelectPage";

beforeAll(() => {
  // Mock IntersectionObserver for framer-motion whileInView in jsdom
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

describe("LandingPage", () => {
  it("renders the hero title, CTAs, and cartoon astronaut mascot", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Ready for Liftoff/i)).toBeInTheDocument();
    expect(screen.getByText("START MISSION")).toBeInTheDocument();
    expect(screen.getAllByText("Buy Me a Coffee").length).toBeGreaterThan(0);
    expect(screen.getAllByText("LinkedIn").length).toBeGreaterThan(0);
    expect(
      screen.getByAltText("Cosmosyy Cartoon Astronaut Mascot"),
    ).toBeInTheDocument();
  });
});

describe("MissionSelectPage", () => {
  it("renders the title and mission cards", () => {
    render(
      <MemoryRouter>
        <MissionSelectPage />
      </MemoryRouter>,
    );
    expect(screen.getAllByText("Cosmosyy").length).toBeGreaterThan(0);
    expect(screen.getByText("Apollo 11")).toBeInTheDocument();
    expect(screen.getByText("Sea of Tranquility")).toBeInTheDocument();
  });
});

