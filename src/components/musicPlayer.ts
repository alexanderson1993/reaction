import { useLevelStore } from "../stores/levelStore";
import { playSound } from "./playSound";

let playing = false;
const playMusic = async () => {
  if (!playing) {
    playing = true;
    const volume = useLevelStore.getState().musicVolume * 0.5;
    console.log(volume);
    const music = await playSound({
      url: "/music/void.ogg",
      loop: true,
      volume,
    });
    // useLevelStore.subscribe(
    //   (value: number) => {
    //     if (music) {
    //       music.volume = value;

    //       music.gain.gain.setValueAtTime(value * value * 0.5, 0);
    //     }
    //   },
    //   (store) => store.musicVolume
    // );
  }
};
playMusic();
document.addEventListener("click", playMusic);
