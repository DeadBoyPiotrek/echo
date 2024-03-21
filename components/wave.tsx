import React, { useEffect, useRef } from 'react';
import Wavesurfer from 'wavesurfer.js';

export const Wave = () => {
  const waveformRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = Wavesurfer.create({
        container: `#${waveformRef.current.id}`,
        waveColor: 'violet',
        progressColor: 'purple',
        height: 200,
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        cursorColor: 'navy',
      });

      wavesurfer.loadBlob(audioBlob);
    }
  }, []);

  return (
    <div>
      <div id="waveform" ref={waveformRef} />
    </div>
  );
};
