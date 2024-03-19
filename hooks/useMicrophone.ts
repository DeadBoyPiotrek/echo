const useMicrophone = () => {
  const audioChunks: Blob[] = [];
  let mediaRecorder: MediaRecorder | null = null;

  // set media recorder
  const setup = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    mediaRecorder = new MediaRecorder(stream);

    // set media recorder event listeners
    if (mediaRecorder) {
      console.log('getting data...');
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, {
          type: 'audio/wav',
        });
        console.log(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      };
    }
    console.log('media recorder set');
  };
  setup();

  const startRecording = () => {
    console.log('start recording');
    if (mediaRecorder) {
      mediaRecorder.start();
    }
  };

  const stopRecording = () => {
    console.log('stop recording');
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  console.log(mediaRecorder?.state);

  return {
    startRecording,
    stopRecording,
    status: mediaRecorder?.state,
  };
};

export default useMicrophone;

//TODO: update status on status change
