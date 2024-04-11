import Wavesurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { useEffect, useRef, useState } from 'react';

export const useRecorder = () => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<Wavesurfer | null>(null);
  const recordRef = useRef<RecordPlugin | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    const handleEffect = async () => {
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
      }
    };
    handleEffect();
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  const startRecording = async () => {
    if (recordRef.current === null) return;
    recordRef.current.startRecording();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recordRef.current === null) return;
    recordRef.current.stopRecording();
    setIsRecording(false);
  };

  const loadAudio = (audioBlob: Blob) => {
    if (wavesurferRef.current === null) return;
    wavesurferRef.current.loadBlob(audioBlob);
    wavesurferRef.current.play();
  };

  return {
    recordRef,
    waveformRef,
    startRecording,
    stopRecording,
    isRecording,
    loadAudio,
  };
};
