// export const getCurrentWeather = async (city: string) => {
//   const response = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`
//   );

//   const data = await response.json();

//   return data;
// };

// export const getDailySummary = async (date: string) => {
//   const key = process.env.RESCUE_TIME_API_KEY;
//   const url = `https://www.rescuetime.com/anapi/daily_summary_feed?key=${key}&date=${date}`;
//   console.log(`🚀 ~ getDailySummary ~ url:`, url);
//   const response = await fetch(url);

//   const data = await response.json();

//   return data;
// };

// export const getTodaysDate = async () => {
//   const date = new Date();
//   const todaysDate = date.toISOString().split('T')[0];
//   return todaysDate;
// };

// gptFunctions.ts

export interface FunctionSpecification {
  name: string;
  description: string;
  parameters?: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
}

interface AvailableFunctions {
  [key: string]: {
    function: Function;
    spec: FunctionSpecification;
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
  console.log(`🚀 ~ getDailySummary ~ url:`, url);
  const response = await fetch(url);

  const data = await response.json();

  return data;
};

const getTodaysDate: Function = async () => {
  const date = new Date();
  const todaysDate = date.toISOString().split('T')[0];
  return todaysDate;
};

const availableFunctions: AvailableFunctions = {
  getCurrentWeather: {
    function: getCurrentWeather,
    spec: {
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
    function: getDailySummary,
    spec: {
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
  getTodaysDate: {
    function: getTodaysDate,
    spec: {
      name: 'getTodaysDate',
      description: 'Get the todays date in this format: YYYY-MM-DD',
    },
  },
};

export { availableFunctions };
