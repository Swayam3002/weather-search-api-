const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

function getApiKey() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('Missing VITE_OPENWEATHER_API_KEY. Add it to .env.local and restart Vite.');
  }

  return apiKey;
}

/** Look up matching city locations and return their coordinates. */
export async function geocodeCity(cityName) {
  const params = new URLSearchParams({
    q: cityName.trim(),
    limit: '5',
    appid: getApiKey(),
  });
  const response = await fetch(`${GEOCODING_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Geocoding request failed (${response.status} ${response.statusText}).`);
  }

  return response.json();
}

/** Fetch current weather for a geocoded location. */
export async function fetchCurrentWeather({ lat, lon }) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    units: 'metric',
    appid: getApiKey(),
  });
  const response = await fetch(`${CURRENT_WEATHER_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather request failed (${response.status} ${response.statusText}).`);
  }

  return response.json();
}
