'use client';
import { Awake } from './components/awake';
import Mic from './components/mic';
import { Wave } from './components/wave';
import { WaveRecord } from './components/waveRecord';
export default function Home() {
  const transcribe = async () => {
    await fetch('/api/speechToText');
  };

  const textToSpeech = async () => {
    await fetch('/api/textToSpeech');
  };

  return (
    <main className=" p-3 flex flex-col gap-3 items-center">
      <h1 className="text-4xl">ECHO</h1>
      <WaveRecord />
      {/* <Wave /> */}
      {/* <Mic /> */}
      {/* <Awake /> */}
    </main>
  );
}
