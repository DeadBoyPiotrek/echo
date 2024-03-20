import React from 'react';
import useMicrophone from '../hooks/useMicrophone';

const Mic: React.FC = () => {
  const { status, startRecording, stopRecording, blob } = useMicrophone();
  console.log(`🚀 ~ blob:in mic`, blob);

  fetch('/api/speechToText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ blob }),
  });

  return (
    <div className="border flex flex-col">
      <p>Microphone status: {status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};

export default Mic;
