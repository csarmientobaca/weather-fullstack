// src/components/WeatherComponent.js
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_WEATHER } from '../queries';

function WeatherComponent({ lat, lon }) {
    const { loading, error, data } = useQuery(GET_WEATHER, {
        variables: { lat, lon },
    });

    return (
        <div>
            <h1>{data.getWeather.name}</h1>
            {/* Display other weather data */}
        </div>
    );
}

export default WeatherComponent;
