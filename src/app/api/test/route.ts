import OpenAI from 'openai';
import {
  getTodaysDate,
  getCurrentWeather,
  getDailySummary,
} from '@lib/gptFunctions';
const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

export async function POST(request: Request) {
  const data = await request.json();
  const availableFunctions = {
    getCurrentWeather,
    getDailySummary,
    getTodaysDate,
  };
  try {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: 'You give very short answers' },
      { role: 'user', content: data.text },
    ];

    // const tools = [];
    while (true) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        tools: [
          {
            type: 'function',
            function: {
              name: 'getCurrentWeather',
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
          {
            type: 'function',
            function: {
              name: 'getDailySummary',
              description: 'Get the daily summary of my activities',
              parameters: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string',
                    description: 'date in this format: YYYY-MM-DD',
                  },
                },
                required: ['date'],
              },
            },
          },
          {
            type: 'function',
            function: {
              name: 'getTodaysDate',
              description: 'Get the todays date',
            },
          },
        ],
      });
      const completionMessage = completion.choices[0].message;
      console.log(JSON.stringify(completionMessage, null, 2));

      const toolCalls = completionMessage.tool_calls;
      if (toolCalls) {
        messages.push(completionMessage);
        console.log('messages', JSON.stringify(messages, null, 2));
        for (const toolCall of toolCalls) {
          const functionName = toolCall.function.name;
          const functionToCall =
            availableFunctions[functionName as keyof typeof availableFunctions];
          const functionArgs = JSON.parse(toolCall.function.arguments);
          const argsValues = Object.values(functionArgs)[0] as string;
          console.log(`🚀 ~ POST ~ argsValues:`, argsValues);

          const functionResponse = await functionToCall(argsValues);

          messages.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            content: JSON.stringify(functionResponse),
          });
        }
        const secondCompletion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages,
        });

        const secondCompletionMessage = secondCompletion.choices[0].message;
        console.log(
          `🚀 ~ POST ~ secondCompletionMessage:`,
          secondCompletionMessage
        );
        messages.push(secondCompletionMessage);
      }
      if (completion.choices[0].finish_reason === 'stop') {
        break;
      }
    }
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ message: 'Error' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'Hello from test' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
