'use client';
import { useEffect } from 'react';
import { useAwake } from '../../hooks/useAwake';
import { useRecorder } from '../../hooks/useRecorder';
import { Awake } from './components/awake';
import { WaveRecord } from './components/waveRecord';
export default function Home() {
  // const transcribe = async () => {
  //   await fetch('/api/speechToText');
  // };

  // const textToSpeech = async () => {
  //   await fetch('/api/textToSpeech');
  // };

  const {
    handleStartRecording,
    handleStopRecording,
    isRecording,
    waveformRef,
  } = useRecorder();

  const { error, isListening, keywordDetection, start, stop } = useAwake();

  useEffect(() => {
    if (keywordDetection !== null) {
      console.log('Keyword detected:', keywordDetection.label);
      // record audio
      handleStartRecording();
    }
  }, [keywordDetection]);

  return (
    <main className=" p-3 flex flex-col gap-3 items-center">
      <h1 className="text-4xl">ECHO</h1>
      <div ref={waveformRef}></div>
      {isRecording ? 'Recording...' : 'not recording'}
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>

      <button onClick={start} disabled={isListening}>
        Start listening wake word
      </button>
      <button onClick={stop} disabled={!isListening}>
        Stop listening wake word
      </button>
      {error && <div>Error: {error.message}</div>}

      {/* <WaveRecord startRecording={handleStartRecording} /> */}
      {/* <Awake /> */}
    </main>
  );
}
