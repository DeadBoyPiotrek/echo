'use client';
import { Awake } from '../../components/awake';
import Mic from '../../components/mic';
export default function Home() {
  const transcribe = async () => {
    await fetch('/api/speechToText');
  };

  const textToSpeech = async () => {
    await fetch('/api/textToSpeech');
  };

  return (
    <main className="border p-3 flex flex-col gap-3">
      <h1 className="text-4xl">ECHO</h1>

      <Mic />

      {/* <Awake /> */}
      {/* <button className="border p-3" onClick={transcribe}>
        speech to text
      </button>
      <button className="border p-3" onClick={textToSpeech}>
        text to speech
      </button> */}
    </main>
  );
}
