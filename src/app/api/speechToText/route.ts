import OpenAI, { toFile } from 'openai';

const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

export async function POST(request: Request) {
  try {
    //* speech-to-text
    const data = await request.formData();
    const audioBlob = data.get('blob') as Blob;
    const audioFile = new File([audioBlob], 'audio.wav');
    const transcriptionText = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });
    console.log(transcriptionText.text);

    //* gpt-3
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: transcriptionText.text },
      ],
    });
    console.log(completion.choices[0].message.content);

    //* text-to-speech
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: `${completion.choices[0].message.content}`,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    console.log(`🚀 ~ POST ~ blob:`, blob);

    return new Response(blob, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ status: 500, message: 'Internal Server Error' });
  }
}
