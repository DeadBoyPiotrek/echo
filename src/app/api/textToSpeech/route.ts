import path from 'path';
import OpenAI from 'openai';
import fs from 'fs';
const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

export async function GET() {
  const filePath = 'response.mp3';
  const fullPath = path.join(process.cwd(), 'public', filePath);

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: `hello`,
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.writeFile(fullPath, buffer);

  return Response.json({ data: 'lol' });
}
