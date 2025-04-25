export const fetchWeather = async (city: string, unit: 'metric' | 'imperial') => {
    const res = await fetch(`http://127.0.0.1:8000/api/weather?city=${city}&unit=${unit}`);
    if (!res.ok) throw new Error('Failed to fetch weather');
    return res.json();
  };
  