import React from 'react';
import Image from 'next/image';

interface ForecastItem {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

interface Props {
  forecast: ForecastItem[];
}

const WeatherCard: React.FC<Props> = ({ forecast }) => {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {forecast.slice(0, 3).map((day, index) => (
        <div
          key={index}
          className="card min-w-[100px] bg-base-300 p-4 flex flex-col items-center text-center shadow"
        >
          <p className="text-sm">{day.date}</p>
          <Image
            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
            alt={day.description}
            width={50}
            height={50}
          />
          <p className="text-lg font-bold">{Math.round(day.temperature)}°</p>
        </div>
      ))}
    </div>
  );
};

export default WeatherCard;
