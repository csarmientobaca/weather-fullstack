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
        const { lat, lon } = req.body;
        console.log(lat, lon)
        const apiKey = process.env.WEATHER_API_KEY;

        //the apkey is form the .env.local
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=it&appid=${apiKey}&units=metric`;
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
    console.log(`server on port ${PORT}`);
});
