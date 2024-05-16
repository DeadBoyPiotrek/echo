import Wavesurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import React, { useEffect, useRef, useState } from 'react';

export const WaveRecord = () => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<Wavesurfer | null>(null); // Ref to store wavesurfer instance
  const recordRef = useRef<RecordPlugin | null>(null); // Ref to store record plugin instance
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = Wavesurfer.create({
        container: waveformRef.current,
        width: 400,
        waveColor: 'white',
        height: 100,
        barGap: 10,
        barWidth: 5,
        barHeight: 2,
        barRadius: 3,
        audioRate: 1,
      });
    }
    if (waveformRef.current && wavesurferRef.current) {
      recordRef.current = wavesurferRef.current.registerPlugin(
        RecordPlugin.create({})
      );

      recordRef.current.on('record-end', audioBlob => {
        console.log(audioBlob);
        // const audioUrl = URL.createObjectURL(audioBlob);
        // const audio = new Audio(aadioUrl);
        // audio.play();
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
      <div ref={waveformRef}></div>
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
