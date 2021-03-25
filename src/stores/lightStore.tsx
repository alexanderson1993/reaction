import create from "zustand";

export const lightStore = create<{
  lightsActive: boolean;
  activateLights: () => void;
}>((set) => ({
  lightsActive: true,
  activateLights: () => set({ lightsActive: true }),
}));
