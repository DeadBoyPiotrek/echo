import OpenAI from 'openai';
import { availableFunctions } from '@lib/gptFunctions';
const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

export async function POST(request: Request) {
  const data = await request.json();
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: 'You give straightforward answers' },
    { role: 'user', content: data.text },
  ];

  try {
    const tools = Object.values(availableFunctions).map(({ spec }) => ({
      type: 'function' as 'function',
      function: spec,
    }));

    while (true) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        tools,
      });
      const completionMessage = completion.choices[0].message;
      messages.push(completionMessage);

      const toolCalls = completionMessage.tool_calls;
      if (toolCalls) {
        for (const toolCall of toolCalls) {
          const functionName = toolCall.function.name;
          const functionToCall = availableFunctions[functionName].function;
          const functionArgs = JSON.parse(toolCall.function.arguments);
          const argsValues = Object.values(functionArgs)[0] as string;

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
  console.log('messages', JSON.stringify(messages, null, 2));
  return new Response(
    JSON.stringify({ message: messages[messages.length - 1].content }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
