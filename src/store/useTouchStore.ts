import { create } from "zustand";

interface TouchState {
  // Joystick movement (-1 to 1)
  moveX: number;
  moveZ: number;

  // Camera look deltas (accumulated between frames)
  lookDeltaX: number;
  lookDeltaY: number;

  // Action buttons
  jump: boolean;
  sprint: boolean;
  scanning: boolean;
  flag: boolean;
  launch: boolean;
  closeInspect: boolean;

  // Setters
  setMove: (x: number, z: number) => void;
  addLookDelta: (dx: number, dy: number) => void;
  consumeLookDelta: () => { dx: number; dy: number };
  setJump: (v: boolean) => void;
  setSprint: (v: boolean) => void;
  setScanning: (v: boolean) => void;
  setFlag: () => void;
  setLaunch: () => void;
  setCloseInspect: () => void;
  reset: () => void;
}

export const useTouchStore = create<TouchState>((set, get) => ({
  moveX: 0,
  moveZ: 0,
  lookDeltaX: 0,
  lookDeltaY: 0,
  jump: false,
  sprint: false,
  scanning: false,
  flag: false,
  launch: false,
  closeInspect: false,

  setMove: (x, z) => set({ moveX: x, moveZ: z }),

  addLookDelta: (dx, dy) =>
    set((s) => ({
      lookDeltaX: s.lookDeltaX + dx,
      lookDeltaY: s.lookDeltaY + dy,
    })),

  consumeLookDelta: () => {
    const { lookDeltaX, lookDeltaY } = get();
    if (lookDeltaX !== 0 || lookDeltaY !== 0) {
      set({ lookDeltaX: 0, lookDeltaY: 0 });
    }
    return { dx: lookDeltaX, dy: lookDeltaY };
  },

  setJump: (v) => set({ jump: v }),
  setSprint: (v) => set({ sprint: v }),
  setScanning: (v) => set({ scanning: v }),
  setFlag: () => set({ flag: true }),
  setLaunch: () => set({ launch: true }),
  setCloseInspect: () => set({ closeInspect: true }),

  reset: () =>
    set({
      moveX: 0,
      moveZ: 0,
      lookDeltaX: 0,
      lookDeltaY: 0,
      jump: false,
      sprint: false,
      scanning: false,
      flag: false,
      launch: false,
      closeInspect: false,
    }),
}));
