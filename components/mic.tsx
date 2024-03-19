import React from 'react';
import useMicrophone from '../hooks/useMicrophone';

const Mic: React.FC = () => {
  const { status, startRecording, stopRecording } = useMicrophone();

  return (
    <div className="border flex flex-col">
      <p>Microphone status: {status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};

export default Mic;
