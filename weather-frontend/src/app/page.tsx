/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { fetchWeather } from '@/lib/api';
import WeatherCard from '@/components/WeatherCard';

interface WeatherData {
  city: string;
  icon: string;
  description: string;
  temperature: number;
  wind: number;
  humidity: number;
  forecast: Array<{ date: string; temperature: number; description: string; icon: string }>;
}

export default function Home() {
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to capitalize the first letter of each word
  const capitalizeCityName = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Function to convert temperature between Celsius and Fahrenheit
  const convertTemperature = (temp: number, toUnit: 'metric' | 'imperial') => {
    return toUnit === 'metric' ? ((temp - 32) * 5) / 9 : (temp * 9) / 5 + 32;
  };

  const toggleUnit = () => {
    if (!weather) return;

    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);

    // Update the weather state with converted values
    setWeather({
      ...weather,
      temperature: Math.round(convertTemperature(weather.temperature, newUnit)),
      forecast: weather.forecast.map((item) => ({
        ...item,
        temperature: Math.round(convertTemperature(item.temperature, newUnit)),
      })),
      wind: newUnit === 'metric' ? weather.wind * 0.44704 : weather.wind / 0.44704, // Convert m/s to mph or vice versa
    });
  };

  const search = async () => {
    if (!city.trim()) {
      alert('Please enter a city name.');
      return;
    }

    const formattedCity = capitalizeCityName(city); // Capitalize the city name
    setLoading(true);
    try {
      const data = await fetchWeather(formattedCity, unit);
      setWeather({
        ...data,
        forecast: data.forecast.map((item: any) => ({
          ...item,
          icon: item.icon || '01d',
        })),
      });
    } catch {
      alert('Failed to fetch weather.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-base-100 text-base-content">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center"> Weather Forecast</h1>

        {/* Search */}
        <div className="form-control w-full flex gap-4 items-center justify-center mt-4">
          <input
            type="text"
            placeholder="Enter city name"
            className="input input-bordered w-full"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="btn btn-primary" onClick={search}>
            Search
          </button>
        </div>

        {/* Unit Switch */}
        <div className="flex justify-end">
          <label className="label cursor-pointer gap-2">
            <span className="label-text">°C</span>
            <input
              type="checkbox"
              className="toggle"
              checked={unit === 'imperial'}
              onChange={toggleUnit}
            />
            <span className="label-text">°F</span>
          </label>
        </div>

        {/* Weather Display */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : weather ? (
          <div className="space-y-6">
            <div className="card bg-base-200 shadow-md p-4 text-center">
              <h2 className="text-xl font-semibold">{capitalizeCityName(weather.city)}</h2>
              <p className="text-sm mb-2">{new Date().toLocaleDateString()}</p>
              <Image
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt="weather icon"
                width={80}
                height={80}
                className="mx-auto"
              />
              <p className="text-4xl font-bold">
                {Math.round(weather.temperature)}° {unit === 'metric' ? 'C' : 'F'}
              </p>
              <p className="capitalize">{weather.description}</p>
            </div>

            {/* Forecast */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Next 3 Days</h3>
              <WeatherCard forecast={weather.forecast} />
            </div>

            {/* Wind + Humidity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card bg-base-200 p-4 text-center">
                <p className="text-sm">Wind</p>
                <p className="text-xl">
                  {unit === 'metric'
                    ? `${Math.round(weather.wind)} m/s`
                    : `${Math.round(weather.wind)} mph`}
                </p>
              </div>
              <div className="card bg-base-200 p-4 text-center">
                <p className="text-sm">Humidity</p>
                <p className="text-xl">{weather.humidity}%</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}