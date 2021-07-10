import { useLevelStore } from "../stores/levelStore";

const audioContext: AudioContext = new AudioContext();

export function playSound(opts: {
  muted?: boolean;
  volume?: number;
  loop?: boolean;
  url: string;
  pitch?: boolean;
}) {
  const volume =
    (opts.muted ? 0 : opts.volume ?? 1) *
    (opts.url === "/music/void.ogg" ? 1 : useLevelStore.getState().soundVolume);
  const asset = opts.url;
  if (!asset) throw new Error("URL is required.");
  return fetch(asset)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => {
      // Connect the sound source to the volume control.
      // Create a buffer from the response ArrayBuffer.
      const sound = {
        ...opts,
        source: audioContext.createBufferSource(),
        gain: audioContext.createGain(),
      };
      if (opts.pitch) {
        sound.source.playbackRate.setValueAtTime(
          1 + (Math.random() - 0.5) * 0.3,
          0
        );
      }
      // Use an x * x curve, since linear isn't super great with volume.
      sound.gain.gain.setValueAtTime(volume * volume, 0);
      sound.source.connect(sound.gain);

      sound.gain.connect(audioContext.destination);
      sound.source.loop = opts.loop || false;

      audioContext.decodeAudioData(
        arrayBuffer,
        (buffer) => {
          //Create a new buffer and set it to the specified channel.
          sound.source.buffer = buffer;
          sound.source.start();
        },
        function onFailure() {
          // console.error(new Error("Decoding the audio buffer failed"));
        }
      );
      return sound;
    })
    .catch((err) => {
      console.log("There was an error", err);
    });
}
