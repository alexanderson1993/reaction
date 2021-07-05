const audioContext: AudioContext = new AudioContext();

export function playSound(opts: {
  muted?: boolean;
  volume?: number;
  loop?: boolean;
  url: string;
  pitch?: boolean;
}) {
  console.log("playing sound");
  const volume = opts.muted ? 0 : opts.volume || 1;
  const asset = opts.url;
  if (!asset) return;
  try {
    fetch(asset)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        // Connect the sound source to the volume control.
        // Create a buffer from the response ArrayBuffer.
        audioContext.decodeAudioData(
          arrayBuffer,
          (buffer) => {
            const sound = {
              ...opts,
              source: audioContext.createBufferSource(),
              gain: audioContext.createGain(),
            };
            //Create a new buffer and set it to the specified channel.
            if (opts.pitch) {
              sound.source.playbackRate.setValueAtTime(
                1 + (Math.random() - 0.5) * 0.3,
                0
              );
            }
            sound.source.buffer = buffer;
            sound.source.loop = opts.loop || false;
            // Use an x * x curve, since linear isn't super great with volume.
            sound.gain.gain.setValueAtTime(volume * volume, 0);
            sound.source.connect(sound.gain);

            sound.gain.connect(audioContext.destination);
            sound.source.start();
          },
          function onFailure() {
            // console.error(new Error("Decoding the audio buffer failed"));
          }
        );
      })
      .catch((err) => {
        console.log("There was an error", err);
      });
  } catch (err) {
    console.log("There was an error", err);
  }
}
