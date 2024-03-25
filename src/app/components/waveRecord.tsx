import Wavesurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import React, { useEffect, useRef, useState } from 'react';

export const WaveRecord = () => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<Wavesurfer | null>(null); // Ref to store wavesurfer instance
  const recordRef = useRef<RecordPlugin | null>(null); // Ref to store record plugin instance
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    console.log('render');
    if (waveformRef.current) {
      console.log('waveformRef.current', waveformRef.current);
      wavesurferRef.current = Wavesurfer.create({
        container: waveformRef.current,
        waveColor: 'violet',
        width: 600,
        height: 200,
        progressColor: 'purple',
      });

      recordRef.current = RecordPlugin.create({
        renderRecordedAudio: true,
        scrollingWaveform: true,
      });
      recordRef.current.on('record-end', audioBlob => {
        console.log('Recording ended');
        console.log(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      });
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  const handleStartRecording = () => {
    if (recordRef.current === null) return;
    recordRef.current.startRecording();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (recordRef.current === null) return;
    recordRef.current.stopRecording();
    setIsRecording(false);
  };

  return (
    <div>
      <div className="" ref={waveformRef}></div>
      <button
        className="rounded-md p-2 bg-blue-500 text-white"
        onClick={() => {
          if (recordRef.current === null) return;
          if (!isRecording) {
            handleStartRecording();
          } else {
            handleStopRecording();
          }
        }}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};
