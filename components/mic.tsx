import React from 'react';
import useMicrophone from '../hooks/useMicrophone';

const Mic: React.FC = () => {
  const { isSupported, isRecording, startRecording, stopRecording, error } =
    useMicrophone();

  if (!isSupported) {
    return <div>Microphone access is not supported in this browser.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="border flex flex-col ">
      <p>Microphone status: {isRecording ? 'Recording' : 'Not Recording'}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};

export default Mic;
