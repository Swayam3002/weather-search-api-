import { useEffect, useState } from 'react';
import { fetchCurrentWeather } from './api/geocoding.js';

export default function CurrentWeather({ location }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      setWeather(null);
      setError('');

      try {
        const result = await fetchCurrentWeather(location);
        if (!cancelled) setWeather(result);
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || 'Could not load current weather.');
      }
    }

    loadWeather();
    return () => {
      cancelled = true;
    };
  }, [location]);

  if (error) return <p className="weather-error" role="alert">{error}</p>;
  if (!weather) return <p role="status">Loading current weather…</p>;

  return (
    <section className="current-weather" aria-live="polite">
      <h2>{location.name}{location.state ? `, ${location.state}` : ''}, {location.country}</h2>
      <p className="weather-temperature">{Math.round(weather.main.temp)}°C</p>
      <p>{weather.weather[0].description}</p>
      <p>Feels like {Math.round(weather.main.feels_like)}°C · Humidity {weather.main.humidity}%</p>
    </section>
  );
}
