import path from 'path';
import fs from 'fs';
import OpenAI from 'openai';
import { Readable } from 'stream';

const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

export async function POST(request: Request) {
  const res = await request.json();
  console.log(res);

  // const filePath = 'record.mp3';
  // const fullPath = path.join(process.cwd(), 'public', filePath);
  // const readableStream = fs.createReadStream(fullPath);
  // const readableStream = blobToStream(audioBlob);
  // console.log(`🚀 ~ POST ~ audioBlob:`, audioBlob);
  // const lol: File = new File([audioBlob], 'name', { type: 'asdf' });
  // const transcriptionText = await openai.audio.transcriptions.create({
  //   file: lol,
  //   model: 'whisper-1',
  // });

  // console.log(transcriptionText.text);

  return Response.json({ data: 'lol' });
}

function blobToStream(blob: Blob) {
  return new Readable({
    read() {
      this.push(blob);
      this.push(null); // Indicates the end of the stream
    },
  });
}
