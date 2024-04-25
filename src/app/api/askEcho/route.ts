import OpenAI from 'openai';
import { availableFunctions } from '@lib/gptFunctions';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions.mjs';
const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

export async function POST(request: Request) {
  let messages: OpenAI.ChatCompletionMessageParam[] = [];
  const model: ChatCompletionCreateParamsBase['model'] = 'gpt-3.5-turbo';
  const formattedDate = new Date().toISOString();
  try {
    const startTime = performance.now();

    //* speech-to-text
    const data = await request.formData();
    const audioBlob = data.get('blob') as Blob;
    const audioFile = new File([audioBlob], 'audio.wav');
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });
    const text = transcriptionResponse.text;
    const speechToTextTime = performance.now();
    console.log(
      'Speech-to-text time:',
      speechToTextTime - startTime,
      'milliseconds'
    );
    messages = [
      {
        role: 'system',
        content: `You're helpful, motivating and kind assistant, you give short straightforward answers that are going to be converted to speech and played, like a human to human, time now: ${formattedDate}`,
      },
      { role: 'user', content: text },
    ];

    //* completion
    const tools = Object.values(availableFunctions).map(value => value.tool);
    const completion = await openai.chat.completions.create({
      model,
      messages,
      tools: tools,
    });
    const completionMessage = completion.choices[0].message;
    messages.push(completionMessage);

    const toolCalls = completionMessage.tool_calls;
    if (toolCalls) {
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName].functionToCall;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const argsValues = Object.values(functionArgs)[0];

        const functionResponse = await functionToCall(argsValues);

        messages.push({
          tool_call_id: toolCall.id,
          role: 'tool',
          content: JSON.stringify(functionResponse),
        });
      }
      const secondCompletion = await openai.chat.completions.create({
        model,
        messages,
      });

      const secondCompletionMessage = secondCompletion.choices[0].message;

      messages.push(secondCompletionMessage);
    }
    const completionTime = performance.now();
    console.log(
      'Completion time:',
      completionTime - speechToTextTime,
      'milliseconds'
    );

    const chatResponse = messages[messages.length - 1].content as string;

    //* text-to-speech
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: chatResponse,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    const blobBase64 = await blob
      .arrayBuffer()
      .then(buffer => Buffer.from(buffer).toString('base64'));

    const textToSpeechTime = performance.now();
    console.log(
      'Text-to-speech time:',
      textToSpeechTime - completionTime,
      'milliseconds'
    );

    const endTime = performance.now();
    console.log('Total time:', endTime - startTime, 'milliseconds');

    console.log('messages', JSON.stringify(messages, null, 2));
    return new Response(
      JSON.stringify({ message: chatResponse, audioBlobBase64: blobBase64 }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.log('messages', JSON.stringify(messages, null, 2));
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
