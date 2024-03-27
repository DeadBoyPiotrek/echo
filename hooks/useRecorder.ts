import Wavesurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { useEffect, useRef, useState } from 'react';

export const useRecorder = () => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<Wavesurfer | null>(null);
  const recordRef = useRef<RecordPlugin | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSilent, setIsSilent] = useState(false);
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
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      });
      recordRef.current.on('record-start', async () => {
        const mediaStream = await recordRef.current?.startMic();
        mediaStream?.
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

  return {
    waveformRef,
    handleStartRecording,
    handleStopRecording,
    isRecording,
  };
};
