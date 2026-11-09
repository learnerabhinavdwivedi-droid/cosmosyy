import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "./useAppStore";
import {
  XP_LAND,
  XP_OBJECT,
  XP_FLAG,
  XP_COMPLETE,
} from "./useAppStore";

beforeEach(() => {
  useAppStore.setState({
    player: { name: "" },
    settings: {
      volume: 0.8,
      captions: true,
      quality: "medium",
      reducedMotion: false,
    },
    progress: {
      missions: {
        "apollo-11": {
          status: "available",
          xp: 0,
          flagPlanted: false,
          objectsFound: [],
        },
      },
      totalXp: 0,
    },
    session: { demoMode: false },
  });
});

describe("useAppStore", () => {
  it("sets player name", () => {
    useAppStore.getState().setPlayerName("Neil");
    expect(useAppStore.getState().player.name).toBe("Neil");
  });

  it("updates settings", () => {
    useAppStore.getState().setSetting("volume", 0.5);
    expect(useAppStore.getState().settings.volume).toBe(0.5);

    useAppStore.getState().setSetting("quality", "high");
    expect(useAppStore.getState().settings.quality).toBe("high");
  });

  it("adds XP to mission and total", () => {
    useAppStore.getState().addXp("apollo-11", XP_LAND);
    const state = useAppStore.getState();
    expect(state.progress.missions["apollo-11"]?.xp).toBe(XP_LAND);
    expect(state.progress.totalXp).toBe(XP_LAND);
  });

  it("ignores addXp for unknown mission", () => {
    useAppStore.getState().addXp("apollo-99", 100);
    expect(useAppStore.getState().progress.totalXp).toBe(0);
  });

  it("finds an object and awards XP_OBJECT", () => {
    useAppStore.getState().findObject("apollo-11", "lrrr");
    const state = useAppStore.getState();
    expect(state.progress.missions["apollo-11"]?.objectsFound).toContain("lrrr");
    expect(state.progress.missions["apollo-11"]?.xp).toBe(XP_OBJECT);
    expect(state.progress.totalXp).toBe(XP_OBJECT);
  });

  it("does not double-count the same object", () => {
    useAppStore.getState().findObject("apollo-11", "lrrr");
    useAppStore.getState().findObject("apollo-11", "lrrr");
    expect(useAppStore.getState().progress.totalXp).toBe(XP_OBJECT);
    expect(
      useAppStore.getState().progress.missions["apollo-11"]?.objectsFound,
    ).toHaveLength(1);
  });

  it("plants flag and awards XP_FLAG", () => {
    useAppStore.getState().plantFlag("apollo-11");
    const state = useAppStore.getState();
    expect(state.progress.missions["apollo-11"]?.flagPlanted).toBe(true);
    expect(state.progress.missions["apollo-11"]?.xp).toBe(XP_FLAG);
    expect(state.progress.totalXp).toBe(XP_FLAG);
  });

  it("does not double-plant flag", () => {
    useAppStore.getState().plantFlag("apollo-11");
    useAppStore.getState().plantFlag("apollo-11");
    expect(useAppStore.getState().progress.totalXp).toBe(XP_FLAG);
  });

  it("completes mission and awards XP_COMPLETE", () => {
    useAppStore.getState().completeMission("apollo-11");
    const state = useAppStore.getState();
    expect(state.progress.missions["apollo-11"]?.status).toBe("completed");
    expect(state.progress.missions["apollo-11"]?.xp).toBe(XP_COMPLETE);
    expect(state.progress.totalXp).toBe(XP_COMPLETE);
  });

  it("does not double-complete mission", () => {
    useAppStore.getState().completeMission("apollo-11");
    useAppStore.getState().completeMission("apollo-11");
    expect(useAppStore.getState().progress.totalXp).toBe(XP_COMPLETE);
  });

  it("starts mission (available → in-progress)", () => {
    useAppStore.getState().startMission("apollo-11");
    expect(useAppStore.getState().progress.missions["apollo-11"]?.status).toBe(
      "in-progress",
    );
  });

  it("does not start a locked mission", () => {
    useAppStore.setState((s) => ({
      progress: {
        ...s.progress,
        missions: {
          ...s.progress.missions,
          "apollo-12": {
            status: "locked",
            xp: 0,
            flagPlanted: false,
            objectsFound: [],
          },
        },
      },
    }));
    useAppStore.getState().startMission("apollo-12");
    expect(useAppStore.getState().progress.missions["apollo-12"]?.status).toBe(
      "locked",
    );
  });

  it("computes rank from totalXp", () => {
    expect(useAppStore.getState().getRank()).toBe("Cadet");

    useAppStore.getState().addXp("apollo-11", 100);
    expect(useAppStore.getState().getRank()).toBe("Pilot");

    useAppStore.getState().addXp("apollo-11", 200);
    expect(useAppStore.getState().getRank()).toBe("Commander");
  });

  it("sets demo mode without persisting", () => {
    useAppStore.getState().setDemoMode(true);
    expect(useAppStore.getState().session.demoMode).toBe(true);
  });

  it("full game flow awards correct total XP", () => {
    const s = useAppStore.getState;
    const a = "apollo-11";

    s().startMission(a);
    s().addXp(a, XP_LAND);
    s().findObject(a, "eagle");
    s().findObject(a, "lrrr");
    s().findObject(a, "seismometer");
    s().findObject(a, "flag");
    s().findObject(a, "plss-gear");
    s().plantFlag(a);
    s().completeMission(a);

    const expected =
      XP_LAND + 5 * XP_OBJECT + XP_FLAG + XP_COMPLETE;
    expect(s().progress.totalXp).toBe(expected);
    expect(s().progress.totalXp).toBe(500);
  });
});
