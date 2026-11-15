import { useReducer } from "react";

export type StoryPlayerStatus = "idle" | "playing" | "paused" | "ended";
export type StoryNarrativeMode = "kids" | "explorer";

export interface StoryPlayerState {
  status: StoryPlayerStatus;
  sceneIndex: number;
  currentSceneIndex: number;
  mode: StoryNarrativeMode;
  cc: boolean;
  captionsEnabled: boolean;
  sound: boolean;
  soundEnabled: boolean;
  totalScenes: number;
}

export type StoryPlayerEvent =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "JUMP"; sceneIndex: number }
  | { type: "REPLAY" }
  | { type: "SET_MODE"; mode: StoryNarrativeMode }
  | { type: "TOGGLE_CC" }
  | { type: "TOGGLE_SOUND" }
  | { type: "SCENE_AUDIO_END" };

/**
 * Pure state transition reducer for Story Card Player
 */
export function storyPlayerReducer(
  state: StoryPlayerState,
  event: StoryPlayerEvent,
): StoryPlayerState {
  switch (event.type) {
    case "START":
      return {
        ...state,
        status: "playing",
        sceneIndex: 0,
        currentSceneIndex: 0,
      };

    case "PAUSE":
      if (state.status !== "playing") return state;
      return {
        ...state,
        status: "paused",
      };

    case "RESUME":
      if (state.status !== "paused") return state;
      return {
        ...state,
        status: "playing",
      };

    case "NEXT": {
      const nextIdx = state.sceneIndex + 1;
      if (nextIdx >= state.totalScenes) {
        return {
          ...state,
          status: "ended",
        };
      }
      return {
        ...state,
        status: "playing",
        sceneIndex: nextIdx,
        currentSceneIndex: nextIdx,
      };
    }

    case "PREV": {
      const prevIdx = Math.max(0, state.sceneIndex - 1);
      return {
        ...state,
        status: "playing",
        sceneIndex: prevIdx,
        currentSceneIndex: prevIdx,
      };
    }

    case "JUMP": {
      const targetIdx = Math.max(0, Math.min(event.sceneIndex, state.totalScenes - 1));
      return {
        ...state,
        status: "playing",
        sceneIndex: targetIdx,
        currentSceneIndex: targetIdx,
      };
    }

    case "REPLAY":
      return {
        ...state,
        status: "playing",
        sceneIndex: 0,
        currentSceneIndex: 0,
      };

    case "SET_MODE":
      if (state.mode === event.mode) return state;
      return {
        ...state,
        mode: event.mode,
        // Switching modes restarts current scene narration
        status: state.status === "ended" ? "ended" : "playing",
      };

    case "TOGGLE_CC": {
      const nextCC = !state.cc;
      // Rule: If CC and Sound are both off, force captions on!
      if (!nextCC && !state.sound) {
        return { ...state, cc: true, captionsEnabled: true };
      }
      return {
        ...state,
        cc: nextCC,
        captionsEnabled: nextCC,
      };
    }

    case "TOGGLE_SOUND": {
      const nextSound = !state.sound;
      // Rule: If CC and Sound are both off, force captions on!
      const nextCC = !nextSound && !state.cc ? true : state.cc;
      return {
        ...state,
        sound: nextSound,
        soundEnabled: nextSound,
        cc: nextCC,
        captionsEnabled: nextCC,
      };
    }

    case "SCENE_AUDIO_END": {
      const nextIdx = state.sceneIndex + 1;
      if (nextIdx >= state.totalScenes) {
        return {
          ...state,
          status: "ended",
        };
      }
      return {
        ...state,
        status: "playing",
        sceneIndex: nextIdx,
        currentSceneIndex: nextIdx,
      };
    }

    default:
      return state;
  }
}

export function createInitialStoryPlayerState(
  totalScenes: number,
  initialStatus: StoryPlayerStatus = "idle",
): StoryPlayerState {
  const total = Math.max(1, totalScenes);
  return {
    status: initialStatus,
    sceneIndex: 0,
    currentSceneIndex: 0,
    mode: "kids",
    cc: true,
    captionsEnabled: true,
    sound: true,
    soundEnabled: true,
    totalScenes: total,
  };
}

export const initialStoryState = (totalScenes = 6): StoryPlayerState =>
  createInitialStoryPlayerState(totalScenes);

export function useStoryPlayer(totalScenes: number, initialStatus: StoryPlayerStatus = "idle") {
  return useReducer(storyPlayerReducer, createInitialStoryPlayerState(totalScenes, initialStatus));
}
