const express = require("express");

const dotenv = require("dotenv");
const cors = require("cors");

require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.post("/api/getWeather", async (req, res) => {
    try {
        const { lat, long } = req.body;
        console.log(lat, long)
        const apiKey = process.env.WEATHER_API_KEY;

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}9&appid=${apiKey}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("External API request failed");
        }

        const weatherData = await response.json();
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
