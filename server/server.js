import Fastify from "fastify"
import dotenv from "dotenv"

import cors from '@fastify/cors'
import mercurius from "mercurius"

(dotenv).config({ path: '.env.local' });

const fastify = Fastify({
    logger: true
})
await fastify.register(cors, {
    // put your options here
})




const typeDef = `
type Coord {
    lon: Float
    lat: Float
  }

  type WeatherInfo {
    id: Int
    main: String
    description: String
    icon: String
  }

  type MainInfo {
    temp: Float
    feels_like: Float
    temp_min: Float
    temp_max: Float
    pressure: Int
    humidity: Int
    sea_level: Int
    grnd_level: Int
  }

  type WindInfo {
    speed: Float
    deg: Int
    gust: Float
  }

  type RainInfo {
    "1h": Float
  }

  type CloudInfo {
    all: Int
  }

  type SysInfo {
    type: Int
    id: Int
    country: String
    sunrise: Int
    sunset: Int
  }

  type Weather {
    coord: Coord
    weather: [WeatherInfo]
    base: String
    main: MainInfo
    visibility: Int
    wind: WindInfo
    rain: RainInfo
    clouds: CloudInfo
    dt: Int
    sys: SysInfo
    timezone: Int
    id: Int
    name: String
    cod: Int
  }

  type Query {
    getWeather(lat: Float!, lon: Float!): Weather
  }
`
const resolvers = {
    Query: {
        weather: async () => {
            return weatherData
        }
    }
}

fastify.register(mercurius, {
    schema: typeDef,
    resolvers: resolvers,
    graphiql: true
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