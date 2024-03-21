import { useEffect, useState } from 'react';

const useMicrophone = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [status, setStatus] = useState<string | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, {
        type: 'audio/wav',
      });
      setAudioBlob(audioBlob);

      console.log(`🚀 ~ audioBlob:`, audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.play();
    }
  }, [audioChunks]);

  useEffect(() => {
    const setup = async () => {
      try {
        // set media recorder
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        // set media recorder event listeners
        recorder.ondataavailable = event => {
          setAudioChunks([...audioChunks, event.data]);
        };

        recorder.onstop = () => {
          setStatus(recorder.state);
        };

        setStatus(recorder.state);
      } catch (error) {
        console.error(error);
      }
    };
    setup();
  }, []);

  const startRecording = () => {
    console.log('start recording');
    if (mediaRecorder) {
      mediaRecorder.start();
      setStatus(mediaRecorder.state);
    }
  };

  const stopRecording = () => {
    console.log('stop recording');
    if (mediaRecorder) {
      mediaRecorder.stop();
      setStatus(mediaRecorder.state);
    }
  };

  return {
    startRecording,
    stopRecording,
    status,
    audioBlob,
  };
};

export default useMicrophone;
