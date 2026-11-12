import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "./useGameStore";

describe("useGameStore State Machine", () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it("initializes with default select state", () => {
    const state = useGameStore.getState();
    expect(state.phase).toBe("select");
    expect(state.missionId).toBeNull();
    expect(state.objectsFoundThisRun).toEqual([]);
    expect(state.inspecting.objectId).toBeNull();
  });

  it("handles full flight to surface transition flow", () => {
    const { send, setMission } = useGameStore.getState();

    setMission("apollo-11");
    expect(useGameStore.getState().missionId).toBe("apollo-11");

    send("LAUNCH_MISSION");
    expect(useGameStore.getState().phase).toBe("flight");

    send("START_COAST");
    expect(useGameStore.getState().phase).toBe("coast");

    send("REACH_ORBIT");
    expect(useGameStore.getState().phase).toBe("orbit");

    send("LOCK_TARGET");
    expect(useGameStore.getState().phase).toBe("targetLocked");

    send("BEGIN_DESCENT");
    expect(useGameStore.getState().phase).toBe("descent");

    send("TOUCH_DOWN");
    expect(useGameStore.getState().phase).toBe("touchdown");

    send("OPEN_HATCH");
    expect(useGameStore.getState().phase).toBe("stepOut");

    send("STEP_OUT");
    expect(useGameStore.getState().phase).toBe("explore");
  });

  it("handles exploration, inspection and returning to explore", () => {
    const { send } = useGameStore.getState();

    // Fast-forward to explore
    useGameStore.setState({ phase: "explore" });

    send("START_INSPECT", { objectId: "lrrr" });
    expect(useGameStore.getState().phase).toBe("inspect");
    expect(useGameStore.getState().inspecting.objectId).toBe("lrrr");

    send("EXIT_INSPECT");
    expect(useGameStore.getState().phase).toBe("explore");
    expect(useGameStore.getState().inspecting.objectId).toBeNull();
  });

  it("transitions from explore to flagReady to flagPlanted to launch and report", () => {
    const { send } = useGameStore.getState();

    useGameStore.setState({ phase: "explore" });

    send("ALL_FOUND");
    expect(useGameStore.getState().phase).toBe("flagReady");

    send("PLANT_FLAG");
    expect(useGameStore.getState().phase).toBe("flagPlanted");

    send("LAUNCH_HOME");
    expect(useGameStore.getState().phase).toBe("launch");

    send("SHOW_REPORT");
    expect(useGameStore.getState().phase).toBe("report");

    send("BACK_TO_SELECT");
    const state = useGameStore.getState();
    expect(state.phase).toBe("select");
    expect(state.missionId).toBeNull();
    expect(state.objectsFoundThisRun).toEqual([]);
  });

  it("tracks found objects uniquely", () => {
    const { addFoundObject } = useGameStore.getState();

    addFoundObject("lrrr");
    addFoundObject("flag");
    addFoundObject("lrrr"); // Duplicate

    expect(useGameStore.getState().objectsFoundThisRun).toEqual(["lrrr", "flag"]);
  });

  it("ignores invalid transitions safely without throwing", () => {
    const { send } = useGameStore.getState();
    expect(useGameStore.getState().phase).toBe("select");

    // Invalid event in select phase
    send("PLANT_FLAG");
    expect(useGameStore.getState().phase).toBe("select");
  });
});

