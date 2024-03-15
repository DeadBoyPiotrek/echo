'use client';
import { useEffect } from 'react';
import { usePorcupine } from '@picovoice/porcupine-react';

export const Awake = () => {
  const porcupineKey = process.env.NEXT_PORCUPINE_API_KEY;
  const { keywordDetection, isLoaded, isListening, error, init, start, stop } =
    usePorcupine();

  const porcupineKeyword = {
    publicPath: './keyword.ppn',
    label: 'hiEcho',
  };
  const porcupineModel = { publicPath: './model.pv' };

  if (!porcupineKey) {
    throw new Error('Porcupine API key missing');
  }

  useEffect(() => {
    init(porcupineKey, porcupineKeyword, porcupineModel);
  }, []);

  useEffect(() => {
    if (keywordDetection !== null) {
      console.log('Keyword detected:', keywordDetection.label);
    }
  }, [keywordDetection]);
  console.log('app');
  return (
    <div>
      <h1 className="font-bold">Welcome echo !</h1>
      <div>{isListening ? 'Listening...' : 'Not listening'}</div>
      <button onClick={start} disabled={!isLoaded || isListening}>
        Start
      </button>
      <button onClick={stop} disabled={!isListening}>
        Stop
      </button>

      {error && <div>Error: {error.message}</div>}
    </div>
  );
};
