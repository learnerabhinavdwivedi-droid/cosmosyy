import { describe, it, expect } from "vitest";
import { storyPlayerReducer, initialStoryState, type StoryPlayerState } from "./useStoryPlayer";

describe("storyPlayerReducer", () => {
  it("initializes with idle state and sound + cc on", () => {
    const s = initialStoryState(6);
    expect(s.status).toBe("idle");
    expect(s.sceneIndex).toBe(0);
    expect(s.mode).toBe("kids");
    expect(s.cc).toBe(true);
    expect(s.sound).toBe(true);
  });

  it("handles START and advances to playing", () => {
    const s0 = initialStoryState(6);
    const s1 = storyPlayerReducer(s0, { type: "START" });
    expect(s1.status).toBe("playing");
    expect(s1.sceneIndex).toBe(0);
  });

  it("handles PAUSE and RESUME", () => {
    const s0: StoryPlayerState = { ...initialStoryState(6), status: "playing" };
    const s1 = storyPlayerReducer(s0, { type: "PAUSE" });
    expect(s1.status).toBe("paused");
    const s2 = storyPlayerReducer(s1, { type: "RESUME" });
    expect(s2.status).toBe("playing");
  });

  it("advances with NEXT up to the last scene, then marks ended", () => {
    let s: StoryPlayerState = { ...initialStoryState(6), status: "playing", sceneIndex: 4 };
    s = storyPlayerReducer(s, { type: "NEXT" });
    expect(s.sceneIndex).toBe(5);
    expect(s.status).toBe("playing");

    s = storyPlayerReducer(s, { type: "NEXT" });
    expect(s.sceneIndex).toBe(5);
    expect(s.status).toBe("ended");
  });

  it("handles PREV correctly and clamps at 0", () => {
    let s: StoryPlayerState = { ...initialStoryState(6), status: "playing", sceneIndex: 2 };
    s = storyPlayerReducer(s, { type: "PREV" });
    expect(s.sceneIndex).toBe(1);

    s = storyPlayerReducer(s, { type: "PREV" });
    expect(s.sceneIndex).toBe(0);

    s = storyPlayerReducer(s, { type: "PREV" });
    expect(s.sceneIndex).toBe(0);
  });

  it("handles JUMP to a valid scene index", () => {
    const s0: StoryPlayerState = { ...initialStoryState(6), status: "playing" };
    const s1 = storyPlayerReducer(s0, { type: "JUMP", sceneIndex: 3 });
    expect(s1.sceneIndex).toBe(3);
  });

  it("handles REPLAY by resetting index to 0 and setting playing", () => {
    const s0: StoryPlayerState = { ...initialStoryState(6), status: "ended", sceneIndex: 5 };
    const s1 = storyPlayerReducer(s0, { type: "REPLAY" });
    expect(s1.sceneIndex).toBe(0);
    expect(s1.status).toBe("playing");
  });

  it("forces CC on if sound is toggled off while CC is off", () => {
    let s: StoryPlayerState = { ...initialStoryState(6), cc: false, sound: true };
    s = storyPlayerReducer(s, { type: "TOGGLE_SOUND" });
    expect(s.sound).toBe(false);
    expect(s.cc).toBe(true);
  });

  it("does not allow toggling CC off when sound is already muted", () => {
    const s0: StoryPlayerState = { ...initialStoryState(6), cc: true, sound: false };
    const s1 = storyPlayerReducer(s0, { type: "TOGGLE_CC" });
    expect(s1.cc).toBe(true);
  });
});
