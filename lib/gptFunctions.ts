export const getCurrentWeather = async (city: string) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`
  );

  const data = await response.json();

  return data;
};

export const getDailySummary = async (date: string) => {
  console.log(`🚀 ~ getDailySummary ~ date:`, date);
  const key = process.env.RESCUE_TIME_API_KEY?.trim();
  console.log(`🚀 ~ getDailySummary ~ key:`, key);
  //  const response = await fetch(
  //  `https://www.rescuetime.com/anapi/daily_summary_feed?key=${key}?date=${date.trim()}`
  //);
  const response = await fetch(
    'https://www.rescuetime.com/anapi/daily_summary_feed?key=B63qHMyVcaPQ45hEbY4WZKTgVgR67hRGEin981jf&date=2024-04-15'
  );
  const data = await response.json();
  console.log(`🚀 ~ getDailySummary ~ data:`, data);

  return data;
};

export const getTodaysDate = async () => {
  const date = new Date();
  const todaysDate = date.toISOString().split('T')[0];
  return todaysDate;
};
