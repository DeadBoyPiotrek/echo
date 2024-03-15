// import fs from 'fs';
// import OpenAI from 'openai';

// const key = process.env.NEXT_OPENAI_API_KEY;
// console.log(`🚀 ~ key:`, key);
// const openai = new OpenAI({ apiKey: key });

export async function transcription() {
  // const transcriptionText = await openai.audio.transcriptions.create({
  //   file: fs.createReadStream('/record.mp3'),
  //   model: 'whisper-1',
  // });

  // console.log(transcriptionText.text);
  console.log('transcription');
}
