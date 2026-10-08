import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './SearchBox.css';
import { useState } from 'react';
import { geocodeCity } from './api/geocoding.js';
import CurrentWeather from './CurrentWeather.jsx';

export default function SearchBox() {
    const [city, setCity] = useState('');
    const [location, setLocation] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLocation(null);
        setIsSearching(true);

        try {
            const locations = await geocodeCity(city);
            if (locations.length === 0) {
                setError(`No locations found for “${city.trim()}”. Try adding a country name.`);
                return;
            }

            // Use the first match for now; location selection can be added for ambiguous names.
            setLocation(locations[0]);
        } catch (requestError) {
            setError(requestError.message || 'Could not search for that city.');
        } finally {
            setIsSearching(false);
        }
    }

    return (
        <div>
            <h1>Search for the weather</h1>
            <form className="SearchBox" onSubmit={handleSubmit}>
                <TextField
                    id="city"
                    label="City Name"
                    variant="outlined"
                    required
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                />
                <Button variant="contained" type="submit" disabled={isSearching}>
                    {isSearching ? 'Searching…' : 'Search'}
                </Button>
            </form>
            {error && <p className="search-error" role="alert">{error}</p>}
            {location && <CurrentWeather location={location} />}
        </div>
    );
}
