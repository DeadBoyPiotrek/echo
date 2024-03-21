import OpenAI from 'openai';

const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

export async function POST(request: Request) {
  const data = await request.formData();
  const audioBlob = data.get('blob') as Blob;
  console.log(`🚀 ~ POST ~ audioBlob:`, audioBlob);

  const audioFile = new File([audioBlob], 'audio.wav');

  const transcriptionText = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
  });
  console.log(transcriptionText.text);

  return Response.json({ data: 'lol' });
}
