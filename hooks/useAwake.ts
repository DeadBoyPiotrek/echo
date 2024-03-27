import { useEffect } from 'react';
import { usePorcupine } from '@picovoice/porcupine-react';

export const useAwake = () => {
  const porcupineKey = process.env.NEXT_PUBLIC_PORCUPINE_API_KEY;

  const { keywordDetection, isListening, error, init, start, stop } =
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

  return {
    isListening,
    start,
    stop,
    error,
    keywordDetection,
  };
};
