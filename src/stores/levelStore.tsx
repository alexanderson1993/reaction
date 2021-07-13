import create from "zustand";
import gameData from "../components/gameData.json";
import { playSound } from "../components/playSound";

export type CellItem =
  | "1"
  | "2"
  | "3"
  | "4"
  | "p"
  | "b"
  | "e"
  | "u"
  | "d"
  | "l"
  | "r"
  | "L"
  | "R"
  | "m"
  | "-"
  | "!"
  | "@"
  | "#"
  | "$"
  | "%"
  | "^"
  | "&"
  | "*"
  | "("
  | ")";

function oppositeDirection(
  direction: "u" | "d" | "l" | "r"
): "u" | "d" | "l" | "r" {
  if (direction === "d") return "u";
  if (direction === "u") return "d";
  if (direction === "l") return "r";
  if (direction === "r") return "l";
  throw new Error("AHHH!");
}

function getLocalStorageNum(key: string) {
  const value = parseFloat(localStorage.getItem(key) ?? "");
  if (isNaN(value)) return 1;
  return value;
}
function getGameData() {
  let data: typeof gameData;
  try {
    data = JSON.parse(localStorage.getItem("game_data") || "");
    if (!Array.isArray(data)) {
      data = gameData;
    }
  } catch {
    data = gameData;
  }
  return data;
}
export const useLevelStore = create<{
  state:
    | "rendering"
    | "credits"
    | "courses"
    | "loading"
    | "playing"
    | "summary"
    | "levelSummary"
    | "settings";
  gameData: typeof gameData;
  setRendered: () => void;
  showCourses: () => void;
  loadCourse: (courseIndex: number) => void;
  loadLevel: () => void;
  currentLevel: string | null;
  particleLocations: ([number, number, "u" | "d" | "l" | "r"] | null)[];
  strokes: { [key: number]: number } | null;
  levelIndex: number | null;
  courseIndex: number | null;
  nextLevel: () => void;
  incrementStrokes: () => void;
  bumpAtom: (cell: number) => void;
  update: () => void;
  reset: () => void;
  restartLevel: () => void;
  showSettings: () => void;
  goToLevelSummary: () => void;
  setParticle: (
    index: number,
    particle: [number, number, "u" | "d" | "l" | "r"] | null
  ) => void;
  makeAlpha: (cell: number, exclude?: ("u" | "d" | "l" | "r")[]) => void;
  tutorial: boolean;
  musicVolume: number;
  soundVolume: number;
}>((set, get) => ({
  state: "credits",
  gameData: getGameData(),
  currentLevel: null,
  particleLocations: Array.from({ length: 100 })
    .fill(0)
    .map((_, i) => null),
  levelIndex: null,
  courseIndex: null,
  strokes: null,
  tutorial: false,
  musicVolume: getLocalStorageNum("music_volume"),
  soundVolume: getLocalStorageNum("sound_volume"),
  reset: () =>
    set({
      state: "credits",
      currentLevel: null,
      strokes: null,
      levelIndex: null,
      courseIndex: null,
    }),
  setRendered: () => set({ state: "credits" }),
  showCourses: () => set({ state: "courses" }),
  loadCourse: async (courseIndex: number) =>
    set({
      state: "loading",
      courseIndex,
      levelIndex: 0,
      strokes: {},
      currentLevel: get().gameData[courseIndex].levels[0].rows,
      tutorial: true,
    }),
  loadLevel: async () => {
    await new Promise((res) => setTimeout(res, 250));
    if (get().state === "loading") set({ state: "playing" });
  },
  nextLevel: async () => {
    set({
      state: "loading",
      particleLocations: Array.from({ length: 100 })
        .fill(0)
        .map((_, i) => null),
    });
    if (
      get().gameData[get().courseIndex ?? 0].levels[
        (get().levelIndex ?? -1) + 1
      ]
    ) {
      await new Promise((res) => setTimeout(res, 500));
      set((state) => {
        return {
          state: "playing",
          tutorial: true,
          levelIndex: (state.levelIndex ?? -1) + 1,

          currentLevel:
            get().gameData[state.courseIndex ?? 0].levels[
              (state.levelIndex ?? -1) + 1
            ]?.rows,
        };
      });
    } else {
      await new Promise((res) => setTimeout(res, 500));

      set({
        state: "summary",
        currentLevel: null,
        particleLocations: Array.from({ length: 100 })
          .fill(0)
          .map((_, i) => null),
      });
    }
  },
  restartLevel: async () => {
    set({
      state: "loading",
    });
    await new Promise((res) => setTimeout(res, 500));
    set((state) => ({
      state: "playing",
      particleLocations: Array.from({ length: 100 })
        .fill(0)
        .map((_, i) => null),
      currentLevel:
        get().gameData[state.courseIndex ?? 0].levels[state.levelIndex ?? -1]
          ?.rows,
      strokes: { ...state.strokes, [state.levelIndex ?? -1]: 0 },
    }));
  },
  showSettings: () => {
    set({ state: "settings" });
  },
  incrementStrokes: () => {
    set((state) => {
      if (state.levelIndex !== null && state.strokes) {
        const strokes = { ...state.strokes };
        if (!state.strokes[state.levelIndex]) {
          strokes[state.levelIndex] = 0;
        }
        strokes[state.levelIndex]++;
        return { strokes };
      }
      return { strokes: state.strokes };
    });
  },
  bumpAtom: (cell: number) => {
    let newLevel = get().currentLevel?.split("") || [];
    const currentState = parseInt(newLevel[cell], 10);
    if (isNaN(currentState)) return;
    newLevel[cell] = currentState === 4 ? "p" : (currentState + 1).toString();
    if (newLevel[cell] === "p") {
      // Create the alpha particles
      playSound({ url: "/wav/pop.wav", pitch: true });
      get().makeAlpha(cell);
    }
    set({ currentLevel: newLevel.join("") });
  },
  makeAlpha: (cell: number, exclude = []) => {
    const particleLocations = get().particleLocations.concat();
    const x = cell % 8;
    const y = Math.floor(cell / 8);
    let directions = ["u" as const, "d" as const, "l" as const, "r" as const];
    for (let i = 0; i < particleLocations.length; i++) {
      if (directions.length === 0) break;
      if (!particleLocations[i]) {
        const nextDir = directions.pop();
        if (!nextDir) break;
        if (exclude.includes(nextDir)) continue;
        get().setParticle(i, [x, y, nextDir]);
      }
    }
  },
  setParticle: (
    index: number,
    particle: [number, number, "u" | "d" | "l" | "r"] | null
  ) => {
    set((state) => {
      let particleLocations = state.particleLocations.concat();
      particleLocations[index] = particle;
      return { particleLocations };
    });
  },
  goToLevelSummary: async () => {
    await new Promise((res) => setTimeout(res, 500));

    set({
      state: "levelSummary",
      particleLocations: Array.from({ length: 100 })
        .fill(0)
        .map((_, i) => null),
    });
  },
  update: () => {
    const moveDistance = (1 / 2) * (6 / 60);
    let particleLocations = get().particleLocations;
    for (
      let particleIndex = 0;
      particleIndex < particleLocations.length;
      particleIndex++
    ) {
      const particle = get().particleLocations[particleIndex];
      if (!particle) continue;
      const [x, y, d] = particle;
      if (x < -2 || x > 9 || y < -2 || y > 9) {
        get().setParticle(particleIndex, null);
        continue;
      }
      if (d === "u")
        get().setParticle(particleIndex, [
          x,
          Math.round((y - moveDistance) * 100) / 100,
          d,
        ]);
      if (d === "d")
        get().setParticle(particleIndex, [
          x,
          Math.round((y + moveDistance) * 100) / 100,
          d,
        ]);
      if (d === "r")
        get().setParticle(particleIndex, [
          Math.round((x + moveDistance) * 100) / 100,
          y,
          d,
        ]);
      if (d === "l")
        get().setParticle(particleIndex, [
          Math.round((x - moveDistance) * 100) / 100,
          y,
          d,
        ]);
      const [newX, newY, dir] = get().particleLocations[particleIndex] || [
        -1,
        -1,
        "d",
      ];

      if (
        newX >= 0 &&
        newX <= 7 &&
        newY >= 0 &&
        newY <= 7 &&
        Number.isInteger(newX) &&
        Number.isInteger(newY)
      ) {
        const particleCell = newX + newY * 8;
        // We're in a cell. Let's see what it holds.
        const cell = get().currentLevel?.[particleCell] as CellItem | undefined;

        if (!cell) continue;
        switch (cell) {
          case "b":
            playSound({ url: "/wav/blackhole.wav", pitch: true });
            get().setParticle(particleIndex, null);
            break;
          case "1":
          case "2":
          case "3":
          case "4":
            get().bumpAtom(particleCell);
            get().setParticle(particleIndex, null);
            break;
          case "e":
            playSound({ url: "/wav/energy.wav", pitch: true });
            get().setParticle(particleIndex, null);
            get().makeAlpha(particleCell, [oppositeDirection(dir)]);
            break;
          case "d":
          case "l":
          case "u":
          case "r":
            playSound({ url: "/wav/arrow.wav", pitch: true });
            get().setParticle(particleIndex, [newX, newY, cell]);

            break;
          case "m":
            playSound({ url: "/wav/mirror.wav", pitch: true });
            get().setParticle(particleIndex, [
              newX,
              newY,
              oppositeDirection(dir),
            ]);
            break;
          case "R": {
            playSound({ url: "/wav/mirror.wav", pitch: true });
            let newDir: "u" | "d" | "l" | "r" = "u";
            if (dir === "u") newDir = "l";
            if (dir === "d") newDir = "r";
            if (dir === "l") newDir = "u";
            if (dir === "r") newDir = "d";
            get().setParticle(particleIndex, [newX, newY, newDir]);

            break;
          }
          case "L": {
            playSound({ url: "/wav/mirror.wav", pitch: true });
            let newDir: "u" | "d" | "l" | "r" = "u";
            if (dir === "u") newDir = "r";
            if (dir === "d") newDir = "l";
            if (dir === "l") newDir = "d";
            if (dir === "r") newDir = "u";
            get().setParticle(particleIndex, [newX, newY, newDir]);

            break;
          }
          case "!":
          case "@":
          case "#":
          case "$":
          case "%":
          case "^":
          case "&":
          case "*":
          case "(":
          case ")":
            // Wormhole
            for (let y = 0; y < 8; y++) {
              for (let x = 0; x < 8; x++) {
                const otherCellIndex = y * 8 + x;
                if (get().currentLevel?.[otherCellIndex] !== cell) continue;
                if (y === newY && x === newX) continue;
                playSound({ url: "/wav/wormhole.wav", pitch: true });
                get().setParticle(particleIndex, [x, y, dir]);
              }
            }
            break;
        }
      }
      // Check to see if the game is over.
      const inProgress = ["1", "2", "3", "4"].some((cell) =>
        get().currentLevel?.includes(cell)
      );
      if (!inProgress && get().state === "playing") {
        // Level complete
        get().goToLevelSummary();
      }
    }
  },
}));
