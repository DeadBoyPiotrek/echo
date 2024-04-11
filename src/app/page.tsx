'use client';
import { useEffect } from 'react';
import { useAwake } from '../../hooks/useAwake';
import { useRecorder } from '../../hooks/useRecorder';

export default function Home() {
  const {
    startRecording,
    stopRecording,
    isRecording,
    waveformRef,
    recordRef,
    loadAudio,
  } = useRecorder();
  const { error, isListening, keywordDetection, start, stop } = useAwake();

  useEffect(() => {
    const handleEffect = async () => {
      const mediaStream = await recordRef.current?.startMic();
      if (mediaStream && keywordDetection !== null) {
        await startRecording();
        handleSilence(mediaStream, stopRecording);
      }
    };

    handleEffect();
  }, [keywordDetection]);

  useEffect(() => {
    if (recordRef.current) {
      recordRef.current.on('record-start', () => {
        console.log('record-start');
      });

      recordRef.current.on('record-end', async audioBlob => {
        const data = new FormData();
        data.append('blob', audioBlob, 'audio.wav');
        try {
          const response = await fetch('/api/speechToText', {
            method: 'POST',
            body: data,
          });
          console.log('response:', response);
          const responseBlob = await response.blob();
          loadAudio(responseBlob);
        } catch (error) {
          console.error('error:', error);
        }
      });
    }
  }, []);

  const handleSilence = (
    mediaStream: MediaStream,
    stopRecording: () => void
  ) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const audioStreamSource = audioContext.createMediaStreamSource(mediaStream);
    audioStreamSource.connect(analyser);
    const bufferLength = analyser.frequencyBinCount;
    const domainData = new Uint8Array(bufferLength);
    let timeout: NodeJS.Timeout | null = null;

    const interval = setInterval(() => {
      analyser.getByteFrequencyData(domainData);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += domainData[i];
      }
      const average = sum / bufferLength;
      console.log(average);
      if (average < 10) {
        if (!timeout) {
          timeout = setTimeout(() => {
            stopRecording();
            clearInterval(interval);
          }, 2000);
        }
      } else {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      }
    }, 100);
  };

  return (
    <main className=" p-3 flex flex-col gap-3 items-center justify-center h-screen">
      <h1 className="text-4xl">ECHO</h1>
      <div ref={waveformRef}></div>
      <p className="p-4 text-xl text-blue-400">
        {isRecording ? 'Recording...' : 'not recording'}
      </p>
      <button className="border p-2 rounded-md" onClick={startRecording}>
        Start Recording
      </button>
      <button className="border p-2 rounded-md" onClick={stopRecording}>
        Stop Recording
      </button>

      <button
        className="border p-2 rounded-md"
        onClick={start}
        disabled={isListening}
      >
        Start listening wake word
      </button>
      <button
        className="border p-2 rounded-md"
        onClick={stop}
        disabled={!isListening}
      >
        Stop listening wake word
      </button>
      {error && <div>Error: {error.message}</div>}
    </main>
  );
}
