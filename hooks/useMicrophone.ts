import { useState, useEffect } from 'react';

type MicrophoneState = {
  isSupported: boolean;
  isRecording: boolean;
  stream: MediaStream | null;
  startRecording: () => void;
  stopRecording: () => void;
  error: string | null;
};

const useMicrophone = (): MicrophoneState => {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      setError('getUserMedia is not supported in this browser');
      return;
    }
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    const getMicrophone = async () => {
      try {
        const microphoneStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setStream(microphoneStream);
      } catch (err: any) {
        setError('Error accessing microphone: ' + err.message);
      }
    };

    getMicrophone();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  return {
    isSupported,
    isRecording,
    stream,
    startRecording,
    stopRecording,
    error,
  };
};

export default useMicrophone;
