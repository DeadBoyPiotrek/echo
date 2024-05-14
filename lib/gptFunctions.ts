import { Client } from '@notionhq/client';
type Priority = 'High Priority' | 'Medium Priority' | 'Low Priority';
import type { OpenAI } from 'openai';
interface AvailableFunctions {
  [key: string]: {
    functionToCall: Function;
    tool: OpenAI.Chat.ChatCompletionTool;
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

    const database = (await notion.databases.query({
      database_id: databaseId,
    })) as any;

    //@ts-ignore
    const todos = database.results.map(todo => {
      const name = todo.properties.Name.title[0].plain_text;
      const status = todo.properties.Status
        ? todo.properties.Status.select?.name || 'Not specified'
        : 'Not specified';
      const done = todo.properties.Done.checkbox;
      const date = todo.properties.Date
        ? new Date(todo.properties.Date.date?.start).toLocaleDateString()
        : 'Not specified';
      const url = todo.url;

      return {
        name,
        status,
        done,
        date,
        // url,
      };
    });
    console.log(`🚀 ~ todos ~ todos:`, todos);

    return todos;
  } catch (error) {
    console.error('Error:', error);
    return error;
  }
};

const availableFunctions: AvailableFunctions = {
  getCurrentWeather: {
    functionToCall: getCurrentWeather,
    tool: {
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
  },
  getDailySummary: {
    functionToCall: getDailySummary,
    tool: {
      type: 'function',
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
  },
  addTodo: {
    functionToCall: addTodo,
    tool: {
      type: 'function',
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
              enum: [
                'High Priority',
                'Medium Priority',
                'Low Priority',
                'No Priority',
              ],
              description:
                'The priority of the todo. Must be exactly one of: High Priority, Medium Priority, Low Priority, or No Priority. If not provided it will be set to No Priority',
            },
          },
          required: ['todoContent', 'date', 'priority'],
        },
      },
    },
  },
  getTodoList: {
    functionToCall: getTodoList,
    tool: {
      type: 'function',
      function: {
        name: 'getTodoList',
        description:
          'Get the list of todos (tasks that i need to do) from my Notion database',
      },
    },
  },
};

export { availableFunctions };
