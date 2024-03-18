import path from 'path';
import OpenAI from 'openai';
import fs from 'fs';
const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

export async function GET() {
  const filePath = 'response.mp3';
  const fullPath = path.join(process.cwd(), 'public', filePath);

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: `By following this approach, you can avoid saving audio files temporarily on the user's device and instead process the audio data and text directly through the APIs. Be sure to review the documentation of the specific APIs and libraries you choose to use for their capabilities and implementation details.
    Yes, you can achieve this functionality by using a combination of speech-to-text and text-to-speech APIs without saving the audio files temporarily on the device. Here's a general outline of how you could implement this.`,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(fullPath, buffer);

  return Response.json({ data: 'lol' });
}
