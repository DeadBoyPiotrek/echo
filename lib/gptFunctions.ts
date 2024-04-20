import { Client } from '@notionhq/client';
type Priority = 'High Priority' | 'Medium Priority' | 'Low Priority';
import type { OpenAI } from 'openai';
// export interface FunctionSpecification {
//   name: string;
//   description: string;
//   parameters?: {
//     type: string;
//     properties: Record<string, { type: string; description: string }>;
//     required: string[];
//   };
// }

interface Tool extends OpenAI.Chat.ChatCompletionTool {
  functionToCall: Function;
}

interface AvailableFunction {
  [key: string]: {
    function: Function;
    spec: Tool;
  };
}

const getCurrentWeather: Function = async (city: string) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`
  );
  const data = await response.json();

  return data;
};

const getDailySummary: Function = async (date: string) => {
  const key = process.env.RESCUE_TIME_API_KEY;
  const url = `https://www.rescuetime.com/anapi/daily_summary_feed?key=${key}&date=${date}`;
  const response = await fetch(url);

  const data = await response.json();

  return data;
};

const addTodo: Function = async (
  todoContent: string,
  date: string,
  priority: Priority
) => {
  console.log('Adding todo:', todoContent, date, priority);
  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const databaseId = process.env.NOTION_TODO_DATABASE_ID;

    if (!databaseId) {
      throw new Error('Database ID is not set');
    }
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: todoContent,
              },
            },
          ],
        },
        Status: {
          select: {
            name: priority,
          },
        },

        Date: {
          date: {
            start: new Date(date).toISOString(),
          },
        },

        Done: {
          checkbox: false,
        },
      },
    });

    console.log(JSON.stringify(response, null, 2));
    return 'Todo added successfully!';
  } catch (error) {
    console.error('Error adding todo: ', error);
    return error;
  }
};

const getTodoList = async () => {
  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const databaseId = process.env.NOTION_TODO_DATABASE_ID;

    if (!databaseId) {
      throw new Error('Database ID is not set');
    }

    const database = await notion.databases.query({
      database_id: databaseId,
    });

    const todos = database.results.map(result => {
      //@ts-ignore
      const { Name, Status, Date } = result.properties;
      return {
        name: Name.title[0].text.content,
        status: Status ? Status.select.name : 'No Priority', // Handling undefined status
        date: Date && Date.date ? Date.date.start : null,
      };
    });
    return JSON.stringify(todos);
  } catch (error) {
    console.error('Error:', error);
    return error;
  }
};

const availableFunctions: AvailableFunction[] = {
  getCurrentWeather: {
    functionToCall: getCurrentWeather,
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
  getDailySummary: {
    functionToCall: getDailySummary,
    function: {
      name: 'getDailySummary',
      description: 'Get the daily summary of my activities',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description:
              '(make sure the date is right!) date in this format: YYYY-MM-DD',
          },
        },
        required: ['date'],
      },
    },
  },
  addTodo: {
    functionToCall: addTodo,
    function: {
      name: 'addTodo',
      description: 'Add a todo to my Notion database',
      parameters: {
        type: 'object',
        properties: {
          todoContent: {
            type: 'string',
            description: 'The content of the todo',
          },
          date: {
            type: 'string',
            description:
              'The date to complete the todo if not provided it will be set to today',
          },
          priority: {
            type: 'string',
            enum: ['High Priority', 'Medium Priority', 'Low Priority'],
            description:
              'The priority of the todo must be exactly one of: High Priority, Medium Priority, Low Priority if not provided it will be set to No Priority',
          },
        },
        required: ['todoContent', 'date', 'priority'],
      },
    },
  },
  getTodoList: {
    functionToCall: getTodoList,
    function: {
      name: 'getTodoList',
      description: 'Get the list of todos from my Notion database',
    },
  },
};

export { availableFunctions };
