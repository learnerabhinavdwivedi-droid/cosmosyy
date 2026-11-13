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
  it(
    "renders the hero title, CTAs, and cartoon astronaut mascot",
    () => {
      render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>,
      );
      expect(screen.getAllByText(/Ready for Liftoff/i).length).toBeGreaterThan(0);
      expect(screen.getByText("START MISSION")).toBeInTheDocument();
      expect(screen.getAllByText("Buy Me a Coffee").length).toBeGreaterThan(0);
      expect(screen.getAllByText("LinkedIn").length).toBeGreaterThan(0);
      expect(
        screen.getByAltText("Cosmosyy Cartoon Astronaut Mascot"),
      ).toBeInTheDocument();
      expect(
        screen.getByAltText("Floating Balloon Cloud Astronaut"),
      ).toBeInTheDocument();
      expect(
        screen.getByAltText("Descending Cartoon Rocket with Blazing Flame"),
      ).toBeInTheDocument();
      expect(
        screen.getByAltText("Resting Cartoon Astronaut Sitting on Border Line"),
      ).toBeInTheDocument();
      expect(
        screen.getAllByAltText(/Martian/i).length,
      ).toBeGreaterThan(0);

      // Verify Abhinav Dwivedi hyperlink to devabhinav.xyz
      const authorLink = screen.getByRole("link", { name: "Abhinav Dwivedi" });
      expect(authorLink).toHaveAttribute("href", "https://devabhinav.xyz/");

      // Verify LinkedIn link
      const linkedinLinks = screen.getAllByRole("link", { name: /LinkedIn/i });
      expect(linkedinLinks[0]).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/abhinav-dwivedi-b074a136a/",
      );
    },
    20000,
  );
});

describe("MissionSelectPage", () => {
  it("renders the title and mission cards", () => {
    render(
      <MemoryRouter>
        <MissionSelectPage />
      </MemoryRouter>,
    );
    expect(screen.getAllByText("Cosmosyy").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Apollo 11").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sea of Tranquility").length).toBeGreaterThan(0);
  });
});

