import useMicrophone from '../hooks/useMicrophone';

const Mic: React.FC = () => {
  const { status, startRecording, stopRecording, audioBlob } = useMicrophone();

  console.log(`🚀 ~ blob ~ blob:`, audioBlob);

  const sendData = async () => {
    const data = new FormData();
    data.append('blob', audioBlob as Blob);
    const res = await fetch('/api/speechToText', {
      method: 'POST',
      body: data,
    });
    console.log(`🚀 ~ sendData ~ res:`, res);
  };
  return (
    <div className="border flex flex-col">
      <p>Microphone status: {status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      {/* <button onClick={sendData}>Send Data</button> */}
    </div>
  );
};

export default Mic;
