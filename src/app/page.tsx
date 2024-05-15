'use client';
import { useEffect, useState } from 'react';
import { useAwake } from '@hooks/useAwake';
import { useRecorder } from '@hooks/useRecorder';
import { PopoverMenu } from './components/popoverMenu';
import { handleRecording, handleSilence } from '@lib/audio';
export default function Home() {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const {
    startRecording,
    stopRecording,
    isRecording,
    waveformRef,
    recordRef,
    loadAudio,
  } = useRecorder();
  const {
    error,
    isListening,
    keywordDetection,
    startListening,
    stopListening,
  } = useAwake();

  //* Start recording when keyword is detected
  useEffect(() => {
    const handleEffect = async () => {
      const stream = await recordRef.current?.startMic();
      if (mediaStream && keywordDetection !== null) {
        setMediaStream(stream);
        handleRecording(startRecording, mediaStream, stopRecording);
      }
    };

    handleEffect();
  }, [keywordDetection]);

  //* Set up recording event listener
  useEffect(() => {
    if (recordRef.current) {
      recordRef.current.on('record-end', async audioBlob => {
        const formData = new FormData();
        formData.append('blob', audioBlob, 'audio.wav');
        try {
          // const response = await fetch('/api/askEcho', {
          //   method: 'POST',
          //   body: formData,
          // });
          // const data = await response.json();
          // const echoResponseBlobBase64 = data.audioBlobBase64;
          // const echoResponseBlob = new Blob(
          //   [Buffer.from(echoResponseBlobBase64, 'base64')],
          //   {
          //     type: 'audio/mpeg',
          //   }
          // );
          // const echoResponseText = data.text;
          // loadAudio(echoResponseBlob);
        } catch (error) {
          console.error('error:', error);
        }
      });
    }
  }, []);

  return (
    <main className="p-3 flex flex-col gap-3 items-center justify-center h-screen">
      <div ref={waveformRef}></div>
      <p className="p-4 text-xl text-blue-400">
        {isRecording ? 'Recording...' : 'not recording'}
      </p>
      <p className="p-4 text-xl text-blue-400">
        {isListening ? 'Listening...' : 'not listening'}
      </p>

      {mediaStream ? (
        <button
          className="border p-2 rounded-md"
          onClick={() =>
            handleRecording(startRecording, mediaStream, stopRecording)
          }
        >
          Start Recording
        </button>
      ) : null}

      <button className="border p-2 rounded-md" onClick={stopRecording}>
        Stop Recording
      </button>

      <button
        className="border p-2 rounded-md"
        onClick={startListening}
        disabled={isListening}
      >
        Start listening wake word
      </button>
      <button
        className="border p-2 rounded-md"
        onClick={stopListening}
        disabled={!isListening}
      >
        Stop listening wake word
      </button>
      {error && <div>Error: {error.message}</div>}
      <PopoverMenu />
      {/* <h1 className="text-[300px] font-bold text-[#0c0b0b] absolute">ECHO</h1> */}
    </main>
  );
}
