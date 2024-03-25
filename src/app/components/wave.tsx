import React, { useEffect, useRef, useState } from 'react';
import Wavesurfer from 'wavesurfer.js';

export const Wave = () => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  let wavesurfer: Wavesurfer | null = null;

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer = Wavesurfer.create({
        container: waveformRef.current,
        waveColor: 'violet',
        width: 600,
        progressColor: 'purple',
      });

      wavesurfer.load('/response.mp3');
    }

    // Cleanup function
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, []);

  const handlePlay = () => {
    if (wavesurfer) {
      if (!isPlaying) {
        wavesurfer.play();
      } else {
        wavesurfer.pause();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <div ref={waveformRef}></div>
      <button onClick={handlePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
};
