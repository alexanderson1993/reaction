import { playSound } from "./playSound";

let playing = false;
document.addEventListener("click", () => {
  if (!playing) {
    playing = true;
    playSound({ url: "/music/void.ogg", loop: true, volume: 0.5 });
  }
});
