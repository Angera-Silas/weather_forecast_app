<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Carbon\Carbon;

class WeatherController extends Controller
{
    public function getWeather(Request $request)
    {
        $city = $request->query('city', 'London');
        $unit = $request->query('unit', 'metric');
        $apiKey = env('OPENWEATHER_API_KEY');

        // Fetch current weather
        $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
            'q' => $city,
            'appid' => $apiKey,
            'units' => $unit,
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to fetch current weather'], 500);
        }

        $data = $response->json();

        // Fetch forecast (5-day data in 3-hour intervals)
        $forecastResponse = Http::get("https://api.openweathermap.org/data/2.5/forecast", [
            'q' => $city,
            'appid' => $apiKey,
            'units' => $unit,
        ]);

        if ($forecastResponse->failed()) {
            return response()->json(['error' => 'Failed to fetch forecast'], 500);
        }

        $forecastData = collect($forecastResponse['list'])
            ->filter(fn($item) => str_contains($item['dt_txt'], '12:00:00')) // pick daily midday forecast
            ->take(3)
            ->map(fn($item) => [
                'date' => Carbon::parse($item['dt_txt'])->format('Y-m-d'),
                'temperature' => $item['main']['temp'],
                'description' => $item['weather'][0]['description'],
                'icon' => $item['weather'][0]['icon'],
            ])
            ->values();

        // Final JSON response
        return response()->json([
            'city' => $data['name'],
            'temperature' => $data['main']['temp'],
            'description' => $data['weather'][0]['description'],
            'icon' => $data['weather'][0]['icon'],
            'humidity' => $data['main']['humidity'],
            'wind' => $data['wind']['speed'],
            'forecast' => $forecastData,
        ]);
    }
}
