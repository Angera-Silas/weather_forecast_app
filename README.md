# Weather App (Next.js + Laravel)

This is a fully decoupled weather forecasting application built using a **Next.js (TypeScript)** frontend and a **Laravel 12 API** backend. It fetches real-time weather data from the [OpenWeatherMap API](https://openweathermap.org/api) and displays it with a clean, responsive interface styled using **TailwindCSS** and **RippleUI**.

This project was developed as part of the **Pawa IT Software Engineer Assessment 2025**.

## Features

- Search for weather by city name  
- Display current temperature and description  
- Show today’s date and location  
- Wind speed and 💧 humidity info  
- 3-day weather forecast  
- Switch between Celsius and Fahrenheit  
- Clean, modular code using Fetch API & Laravel HTTP Client  
- 💅 Fully styled with RippleUI + TailwindCSS  

## Tech Stack

**Frontend**:  

- Next.js 14  
- TypeScript  
- TailwindCSS  
- RippleUI  
- Fetch API  

**Backend**:  

- Laravel 12  
- Laravel HTTP Client (Guzzle)  
- OpenWeatherMap API  
- Carbon  

## Getting Started

### Backend (Laravel API)

1. Navigate to the backend project folder:

    ```bash
    cd weather-api
    ```

2. Install dependencies:

    ```bash
    composer install
    cp .env.example .env
    php artisan key:generate
    ```

3. Add your OpenWeatherMap API key to `.env`:

    ```env
    OPENWEATHER_API_KEY=your_api_key_here
    ```

4. Start the Laravel development server:

    ```bash
    php artisan serve
    ```

    Laravel should now be running at <http://127.0.0.1:8000>.

### Frontend (Next.js)

1. Navigate to the frontend project folder:

    ```bash
    cd weather-frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the development server:

    ```bash
    npm run dev
    ```

    The app will be live at <http://localhost:3000>.

4. Ensure `next.config.js` includes the image domain:

    ```javascript
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'openweathermap.org',
          pathname: '/img/wn/**',
        },
      ],
    }
    ```

## Usage

1. Enter a city name (e.g., "Nairobi").
2. Click the Search button.
3. View:
    - Today's weather icon, temperature, and description.
    - Today's date and location.
    - Wind and humidity data.
    - 3-day forecast with icons and temperatures.
    - Celsius / Fahrenheit toggle.

## Troubleshooting

- **API route returns 404**:  
  Ensure `routes/api.php` contains:

    ```php
    use App\Http\Controllers\WeatherController;
    Route::get('/weather', [WeatherController::class, 'getWeather']);
    ```

- **Hydration Error**:  
  Move dynamic content like `new Date()` into `useEffect`.

- **Image Not Loading**:  
  Make sure `next.config.js` allows `openweathermap.org`.

- **CORS Error**:  
  Allow <http://localhost:3000> in `config/cors.php`:

    ```php
    'allowed_origins' => ['http://localhost:3000'],
    ```

## Key Design Considerations

- API-first architecture (Next.js fetches from Laravel).
- Separation of concerns: backend handles external APIs, frontend handles rendering.
- Forecast is simplified to 3 days (midday values only).
- Client-safe rendering of date to avoid hydration mismatch.

## License

This project is open-source and built solely for assessment/demo purposes. Public API access is unsecured per project guidelines.

## Author

Angera Silas  
<https://https://portfolio-be948.web.app>  
