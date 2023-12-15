import Fastify from "fastify"
import dotenv from "dotenv"

import cors from '@fastify/cors'


(dotenv).config({ path: '.env.local' });

const fastify = Fastify({
    logger: true
})
await fastify.register(cors, {
    // put your options here
})


fastify.post("/api/getWeather", async (request, reply) => {
    try {
        const { lat, lon } = request.body;
        console.log(lat, lon)
        const apiKey = process.env.WEATHER_API_KEY;

        //the apkey is form the .env.local
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=it&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("External API request failed");
        }
        const weatherData = await response.json();
        return weatherData
    } catch (error) {
        console.error(error);
    }
})

fastify.listen({ port: 8080 }, (err, address) => {
    if (err) throw err
})