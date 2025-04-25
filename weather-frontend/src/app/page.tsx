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

  const search = async () => {
    setLoading(true);
    try {
      const data = await fetchWeather(city, unit);
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
        <div className="form-control w-full">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter city name"
              className="input input-bordered w-full"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button className="mt-4 btn btn-primary" onClick={search}>Search</button>
          </div>
        </div>

        {/* Unit Switch */}
        <div className="flex justify-end">
          <label className="label cursor-pointer gap-2">
            <span className="label-text">°C</span>
            <input
              type="checkbox"
              className="toggle"
              checked={unit === 'imperial'}
              onChange={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
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
              <h2 className="text-xl font-semibold">{weather.city}</h2>
              <p className="text-sm mb-2">{new Date().toLocaleDateString()}</p>
              <Image
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt="weather icon"
                width={80}
                height={80}
                className="mx-auto"
              />
              <p className="text-4xl font-bold">{Math.round(weather.temperature)}°</p>
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
                <p className="text-xl">{weather.wind} m/s</p>
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
