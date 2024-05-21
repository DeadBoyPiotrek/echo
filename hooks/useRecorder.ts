import Wavesurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { useEffect, useRef, useState } from 'react';
export const useRecorder = () => {
  const audioOn = typeof Audio !== 'undefined' ? new Audio('on.mp3') : null;
  const audioOff = typeof Audio !== 'undefined' ? new Audio('off.mp3') : null;
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<Wavesurfer | null>(null);
  const recordRef = useRef<RecordPlugin | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
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

        recordRef.current.on('record-start', () => {
          if (audioOn) audioOn.play();
        });

        recordRef.current.on('record-end', () => {
          if (audioOff) audioOff.play();
        });
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
    setIsAudioLoaded(false);
  };

  const stopRecording = () => {
    if (recordRef.current === null) return;

    recordRef.current.stopRecording();
    setIsRecording(false);
  };

  const loadAudioBlob = (audioBlob: Blob) => {
    if (wavesurferRef.current === null) return;
    setIsAudioLoaded(true);
    wavesurferRef.current.loadBlob(audioBlob);
    wavesurferRef.current.play();
  };

  const playAudio = () => {
    if (wavesurferRef.current === null) return;
    wavesurferRef.current.play();
  };

  return {
    recordRef,
    waveformRef,
    startRecording,
    stopRecording,
    isRecording,
    loadAudioBlob,
    playAudio,
    isAudioLoaded,
  };
};
