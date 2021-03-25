import create from "zustand";
import gameData from "../components/gameData.json";

export const useLevelStore = create<{
  state: "rendering" | "credits" | "courses" | "loading" | "playing";
  setRendered: () => void;
  showCourses: () => void;
  loadCourse: (courseIndex: number) => void;
  loadLevel: () => void;
  currentLevel: string | null;
  levelIndex: number | null;
  courseIndex: number | null;
}>((set) => ({
  state: "credits",
  currentLevel: null,
  levelIndex: null,
  courseIndex: null,
  setRendered: () => set({ state: "credits" }),
  showCourses: () => set({ state: "courses" }),
  loadCourse: (courseIndex: number) =>
    set({
      state: "loading",
      courseIndex,
      levelIndex: 0,
      currentLevel: gameData[courseIndex].levels[0].rows,
    }),
  loadLevel: () => set({ state: "playing" }),
}));

window.levelStore = useLevelStore;
