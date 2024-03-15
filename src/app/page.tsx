import { Awake } from '../../components/awake';
import { transcription } from '../../lib/speechToText';
export default function Home() {
  console.log('app');
  return (
    <main>
      <h1>Echo</h1>
      <Awake />
      <button>Transcribe</button>
      <button onClick={transcription}>Transcribe</button>
    </main>
  );
}
