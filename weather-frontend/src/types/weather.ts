export interface WeatherData {
    city: string;
    temperature: number;
    description: string;
    icon: string;
    date: string;
    humidity: number;
    wind: number;
    forecast: {
      date: string;
      temperature: number;
      icon: string;
    }[];
  }
  