import OpenAI from 'openai';
import { availableFunctions } from '@lib/gptFunctions';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions.mjs';
const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

const formattedDate = new Date().toISOString();
const messages: OpenAI.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: `You're helpful, motivating and kind assistant, you give very short straightforward answers that are going to be converted to speech and played, like a human to human, time now: ${formattedDate}
  `,
  },
];
const updateMessageStack = (newMessage: OpenAI.ChatCompletionMessageParam) => {
  const maxMessages = 10;
  if (messages.length >= maxMessages) {
    messages.splice(1, messages.length - 2);
  }
  messages.push(newMessage);
};

export async function POST(request: Request) {
  const model: ChatCompletionCreateParamsBase['model'] = 'gpt-3.5-turbo';
  const data = await request.json();

  updateMessageStack({ role: 'user', content: data.text });

  const tools = Object.values(availableFunctions).map(value => value.tool);

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      tools,
    });
    const completionMessage = completion.choices[0].message;

    updateMessageStack(completionMessage);

    const toolCalls = completionMessage.tool_calls;
    if (toolCalls) {
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName].functionToCall;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const argsValues = Object.values(functionArgs) as string[];

        const functionResponse = await functionToCall(...argsValues);

        updateMessageStack({
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

      updateMessageStack(secondCompletionMessage);
    }
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ message: 'Error' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  console.log('❤️❤️❤️ messages', JSON.stringify(messages, null, 2));
  return new Response(
    JSON.stringify({ message: messages[messages.length - 1].content }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
