import path from 'path';
import fs from 'fs';
import OpenAI from 'openai';

const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

export async function GET() {
  const filePath = 'record.mp3';
  const fullPath = path.join(process.cwd(), 'public', filePath);

  const transcriptionText = await openai.audio.transcriptions.create({
    file: fs.createReadStream(fullPath),
    model: 'whisper-1',
  });

  console.log(transcriptionText.text);

  return Response.json({ data: 'lol' });
}
