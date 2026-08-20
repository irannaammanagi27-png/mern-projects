# Weather App

MERN-ready weather application. The Express API proxies OpenWeather requests so the API key stays server-side. The React client supports city search, current conditions, forecast-friendly response data, and Celsius/Fahrenheit conversion.

## Run

```powershell
cd backend; npm install; Copy-Item .env.example .env; npm run dev
cd ../frontend; npm install; npm run dev
```

Set `OPENWEATHER_API_KEY` in `backend/.env`.
