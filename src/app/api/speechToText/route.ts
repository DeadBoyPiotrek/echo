import OpenAI, { toFile } from 'openai';

const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

const getCurrentWeather = async (city: string) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}`
  );
  const data = await response.json();
  return data;
};

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

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: 'You give very short answers' },
      { role: 'user', content: transcriptionText.text },
    ];
    let inputText: string;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      tools: [
        {
          type: 'function',
          function: {
            name: 'get_current_weather',
            description: 'Get the current weather in a city',
            parameters: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'The city to get the weather for',
                },
              },
              required: ['location'],
            },
          },
        },
      ],
    });

    const completionMessage = completion.choices[0].message;
    if (completionMessage.content) inputText = completionMessage.content;
    console.log(JSON.stringify(completionMessage, null, 2));

    const toolCalls = completionMessage.tool_calls;
    if (toolCalls) {
      const availableFunctions = {
        get_current_weather: getCurrentWeather,
      };
      messages.push(completionMessage);
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResponse = await functionToCall(functionArgs.location);
        messages.push({
          tool_call_id: toolCall.id,
          role: 'tool',
          content: functionResponse,
        });
      }
      const secondCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      });

      const secondCompletionMessage = secondCompletion.choices[0].message;
      if (secondCompletionMessage.content)
        inputText = secondCompletionMessage.content;
      console.log(
        `🚀 ~ POST ~ secondCompletionMessage:`,
        secondCompletionMessage
      );
    }

    //* text-to-speech
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: inputText,
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
