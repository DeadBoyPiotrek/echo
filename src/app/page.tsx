'use client';
import { useEffect, useState } from 'react';
import { useAwake } from '@hooks/useAwake';
import { useRecorder } from '@hooks/useRecorder';
import { handleRecording } from '@lib/audio';
import { DropdownMenu, DropdownMenuItem } from '@/components/dropdownMenu';
import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons';

export default function Home() {
  const [messages, setMessages] = useState<
    | {
        role: string;
        content: string;
      }[]
    | null
  >(null);

  console.log(`🚀 ~ Home ~ messages:`, messages);
  const {
    startRecording,
    stopRecording,
    isRecording,
    waveformRef,
    recordRef,
    loadAudioBlob,
    playAudio,
    isAudioLoaded,
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
          const response = await fetch('/api/askEcho', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          console.log('data:', data);
          // setMessages(
          //   messages
          //     ? [...messages, data.filteredMessages]
          //     : [data.filteredMessages]
          // );
          setMessages(data.filteredMessages);
          const echoResponseBlobBase64 = data.audioBlobBase64;
          const echoResponseBlob = new Blob(
            [Buffer.from(echoResponseBlobBase64, 'base64')],
            {
              type: 'audio/mpeg',
            }
          );
          loadAudioBlob(echoResponseBlob);
        } catch (error) {
          console.error('error:', error);
        }
      });
    }
  }, []);

  return (
    <main className="flex flex-col items-center">
      <div className="p-3 flex flex-col gap-3 items-center justify-center h-screen">
        <div ref={waveformRef}></div>
        <DropdownMenu>
          <div className="flex flex-col font-light">
            <p className=" flex items-center gap-2  ">
              Recording:
              {isRecording ? (
                <CheckIcon className="w-6 h-6" />
              ) : (
                <Cross1Icon className="w-5 h-5" />
              )}
            </p>
            <p
              className="
            flex items-center gap-2
            "
            >
              Listening:{' '}
              {isListening ? (
                <CheckIcon className="w-6 h-6" />
              ) : (
                <Cross1Icon className="w-5 h-5" />
              )}
            </p>

            <div className="h-[1px] w-full bg-white my-1"></div>

            {recordRef.current?.startMic ? (
              <>
                <DropdownMenuItem
                  asChild
                  className={`${
                    isRecording ? 'text-gray-400' : ''
                  } outline-none data-[highlighted]:underline`}
                >
                  <button
                    onClick={async () => {
                      const stream = await recordRef.current?.startMic();
                      // @ts-ignore
                      //TODO: Fix this
                      handleRecording(startRecording, stream, stopRecording);
                    }}
                    disabled={isRecording}
                  >
                    Start Recording
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className={`${
                    !isRecording ? 'text-gray-400' : ''
                  } outline-none data-[highlighted]:underline`}
                >
                  <button onClick={stopRecording} disabled={!isRecording}>
                    Stop Recording
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className={`${
                    isListening ? 'text-gray-400' : ''
                  } outline-none data-[highlighted]:underline text-left`}
                >
                  <button onClick={startListening} disabled={isListening}>
                    Start listening
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className={`${
                    !isListening ? 'text-gray-400' : ''
                  } outline-none data-[highlighted]:underline text-left`}
                >
                  <button onClick={stopListening} disabled={!isListening}>
                    Stop listening
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className={`${
                    !isAudioLoaded ? 'text-gray-400' : ''
                  } outline-none data-[highlighted]:underline text-left`}
                >
                  <button onClick={playAudio} disabled={!isAudioLoaded}>
                    Play audio
                  </button>
                </DropdownMenuItem>
                <p>{error && <div>Error: {error.message}</div>}</p>
              </>
            ) : (
              <div>Microphone not available</div>
            )}
          </div>
        </DropdownMenu>
        <h1 className="text-[300px] font-bold text-echoGray absolute select-none">
          ECHO
        </h1>
      </div>
      <div className="w-[1000px] flex flex-col gap-3">
        {messages &&
          messages.map((message, index) => (
            <pre
              key={index}
              className={`__className_229379 text-wrap p-3 rounded-lg ${
                message.role === 'user' ? 'self-end' : 'self-start'
              } `}
            >
              - {message.content}
            </pre>
          ))}
      </div>
    </main>
  );
}
