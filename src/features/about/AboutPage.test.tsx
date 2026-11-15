import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeAll } from "vitest";
import AboutPage from "./AboutPage";

beforeAll(() => {
  // Mock IntersectionObserver for motion in jsdom
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
  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

describe("AboutPage", () => {
  it("renders the heading and challenge context", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("About Cosmosyy")).toBeInTheDocument();
    expect(screen.getByText("Abandoned but not forgotten.")).toBeInTheDocument();
    expect(screen.getByText("What We Built")).toBeInTheDocument();
  });

  it("renders the 'Why We Built It This Way' section addressing PS considerations", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    // Section title & subtitle
    expect(screen.getByText("Why We Built It This Way")).toBeInTheDocument();
    expect(
      screen.getByText(/Direct choices addressing the NASA Space Apps Challenge considerations/i),
    ).toBeInTheDocument();

    // 1. Age group consideration
    expect(screen.getByText("Age Group")).toBeInTheDocument();
    expect(
      screen.getByText(/Built for school-age explorers \(roughly ages 10-16\) and curious adults/i),
    ).toBeInTheDocument();

    // 2. Accessibility consideration
    expect(screen.getByText("Accessibility")).toBeInTheDocument();
    expect(
      screen.getByText(/Runs offline, in English and Hindi, with captions, reduced motion/i),
    ).toBeInTheDocument();

    // 3. Scope consideration
    expect(screen.getByText("Scope")).toBeInTheDocument();
    expect(
      screen.getByText(
        /We chose breadth over depth: all six Apollo landing sites plus nine Mars missions and five deep-space probes/i,
      ),
    ).toBeInTheDocument();

    // 4. Perspective consideration
    expect(screen.getByText("Perspective")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Every artifact speaks in first person — a 'Dormant Voice Log'/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders NASA data sources including NSSDCA Master Catalog", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("NASA Data & Sources")).toBeInTheDocument();
    expect(screen.getByText("NASA NSSDCA Master Catalog")).toBeInTheDocument();
    const nssdcaLink = screen.getByRole("link", { name: /NASA NSSDCA Master Catalog/i });
    expect(nssdcaLink).toHaveAttribute("href", "https://nssdc.gsfc.nasa.gov/nmc/");
  });
});
