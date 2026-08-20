import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ project: 'Weather App', status: 'ok' }));
app.get('/api/weather', async (req, res) => {
  const city = String(req.query.city || '').trim();
  if (!city) return res.status(400).json({ message: 'City is required' });
  if (!process.env.OPENWEATHER_API_KEY) {
    return res.json({ city, temperature: 24, condition: 'Connect OpenWeather API key', unit: 'C' });
  }
  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.search = new URLSearchParams({ q: city, appid: process.env.OPENWEATHER_API_KEY, units: 'metric' });
  const response = await fetch(url);
  const data = await response.json();
  res.status(response.ok ? 200 : response.status).json(data);
});
app.listen(port, () => console.log(`Weather API running on ${port}`));
