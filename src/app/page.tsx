'use client';
import { useEffect } from 'react';
import { useAwake } from '@hooks/useAwake';
import { useRecorder } from '@hooks/useRecorder';
import { handleRecording } from '@lib/audio';
import { DropdownMenu } from '@/components/dropdownMenu';
import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons';
export default function Home() {
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
      if (stream && keywordDetection !== null) {
        handleRecording(startRecording, stream, stopRecording);
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
      <DropdownMenu>
        <div className="flex flex-col font-light">
          <p className=" flex items-center gap-2  ">
            Recording:
            {isRecording ? <CheckIcon /> : <Cross1Icon className="w-5 h-5" />}
          </p>
          <p
            className="
           flex items-center gap-2
          "
          >
            Listening:{' '}
            {isListening ? <CheckIcon /> : <Cross1Icon className="w-5 h-5" />}
          </p>

          {recordRef.current?.startMic ? (
            <>
              <button
                className=""
                onClick={async () => {
                  const stream = await recordRef.current?.startMic();
                  handleRecording(startRecording, stream, stopRecording);
                }}
              >
                Start Recording
              </button>

              <button className="" onClick={stopRecording}>
                Stop Recording
              </button>

              <button
                className=""
                onClick={startListening}
                disabled={isListening}
              >
                Start listening
              </button>
              <button
                className=""
                onClick={stopListening}
                disabled={!isListening}
              >
                Stop listening
              </button>
              {error && <div>Error: {error.message}</div>}
            </>
          ) : (
            <div>Microphone not available</div>
          )}
        </div>
      </DropdownMenu>
      <h1 className="text-[300px] font-bold text-echoGray absolute ">ECHO</h1>
    </main>
  );
}
