import { useEffect, useState } from 'react';

const useMicrophone = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [status, setStatus] = useState<string | null>(null);
  // const audioChunks: Blob[] = [];
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

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
          // audioChunks.push(event.data);
          setAudioChunks([...audioChunks, event.data]);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, {
            type: 'audio/wav',
          });

          console.log(`🚀 ~ setup ~ audioBlob:`, audioBlob);
          const audioUrl = URL.createObjectURL(audioBlob);

          const audio = new Audio(audioUrl);
          audio.play();
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

  console.log(`🚀 ~ audioChunks:`, audioChunks);

  return {
    startRecording,
    stopRecording,
    status,
    blob: audioChunks[0],
  };
};

export default useMicrophone;
