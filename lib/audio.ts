export const handleSilence = (
  mediaStream: MediaStream,
  stopRecording: () => void
) => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const audioStreamSource = audioContext.createMediaStreamSource(mediaStream);
  audioStreamSource.connect(analyser);
  const bufferLength = analyser.frequencyBinCount;
  const domainData = new Uint8Array(bufferLength);
  let silenceTimeout: NodeJS.Timeout | null = null;
  let silenceInterval: NodeJS.Timeout | null = null;
  let recordingTimeout: NodeJS.Timeout | null = null;

  const checkSilence = () => {
    analyser.getByteFrequencyData(domainData);
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += domainData[i];
    }
    const average = sum / bufferLength;
    console.log(average);
    if (average < 10) {
      if (!silenceTimeout) {
        silenceTimeout = setTimeout(() => {
          stopRecording();
          clearInterval(silenceInterval!);
        }, 2000);
      }
    } else {
      if (silenceTimeout) {
        clearTimeout(silenceTimeout);
        silenceTimeout = null;
      }
    }
  };

  recordingTimeout = setTimeout(() => {
    stopRecording();
    clearInterval(silenceTimeout!);
    clearInterval(recordingTimeout!);
    clearInterval(silenceInterval!);
  }, 10000);

  silenceInterval = setInterval(checkSilence, 100);
};

export const handleRecording = (
  startRecording: () => void,
  mediaStream: MediaStream,
  stopRecording: () => void
) => {
  startRecording();
  handleSilence(mediaStream, stopRecording);
};
