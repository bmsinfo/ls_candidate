import { useCallback, useEffect, useRef, useState } from 'react';

import { getAudioContext, useMediaPermission } from '@/providers/MediaProvider';

const audioLevelThresholds = [0, 5, 10, 15, 20, 25];

const AudioLeveler = () => {
  const [audioLevel, setAudioLevel] = useState(0);
  const audioInterval = useRef<number | null>(null);
  const { webcamStream } = useMediaPermission();

  const updateAudioLevels = useCallback((analyser: AnalyserNode) => {
    // dataArray will give us an array of numbers ranging from 0 to 255
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    // cthese values are between 0 - 255, we want the average and
    // to convert it into a value between 0 - 100
    const audioLevelValue = Math.round((average / 255) * 100);
    setAudioLevel(audioLevelValue);
  }, []);

  const setupStream = useCallback(() => {
    const AudioContext = getAudioContext();
    console.log('### calling only at once ####');

    if (AudioContext) {
      const audioContext = new AudioContext();
      const mediaStreamSource =
        audioContext.createMediaStreamSource(webcamStream);
      const analyser = audioContext.createAnalyser();
      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 1024;
      mediaStreamSource.connect(analyser);

      audioInterval.current = window.setInterval(() => {
        updateAudioLevels(analyser);
      }, 100);
    }
  }, [webcamStream]);

  useEffect(() => {
    setupStream();
    return () => {
      if (audioInterval.current) {
        window.clearInterval(audioInterval.current);
      }
    };
  }, []);

  return (
    <>
      <div className="flex  items-center justify-center gap-2 ">
        <p className=" text-sm border p-1  w-fit px-2 rounded flex">
          {' '}
          Audio Level
        </p>
        <div className="flex items-center justify-center ">
          <div
            className={`level ${
              audioLevel > audioLevelThresholds[0] ? 'active' : ''
            }`}
          />
          <div
            className={`level ${
              audioLevel > audioLevelThresholds[1] ? 'active' : ''
            }`}
          />
          <div
            className={`level ${
              audioLevel > audioLevelThresholds[2] ? 'active' : ''
            }`}
          />
          <div
            className={`level ${
              audioLevel > audioLevelThresholds[3] ? 'active' : ''
            }`}
          />
          <div
            className={`level ${
              audioLevel > audioLevelThresholds[4] ? 'active' : ''
            }`}
          />
          <div
            className={`level ${
              audioLevel > audioLevelThresholds[5] ? 'active' : ''
            }`}
          />
        </div>

        <style jsx>
          {`
            .level {
              width: 20px;
              height: 5px;
              margin-right: 2px;
            }
            .level:last-child {
              margin-right: 0;
            }
            .level {
              background-color: #ccc;
            }
            .level.active {
              background-color: #222;
            }
          `}
        </style>
      </div>
    </>
  );
};

export default AudioLeveler;
