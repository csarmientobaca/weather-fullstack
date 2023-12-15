import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import mercurius from "mercurius";
import fetch from "node-fetch";

dotenv.config({ path: ".env.local" });

const fastify = Fastify({
  logger: true,
});

// cors configuration
fastify.register(cors, {
});

//GraphQL Schema
const typeDefs = `
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
    oneHour: Float
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
`;


//resolver with the same logic as the previus post
const resolvers = {
  Query: {
    getWeather: async (_, { lat, lon }) => {
      try {
        const apiKey = process.env.WEATHER_API_KEY;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=it&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("External API request failed");
        }

        const weatherData = await response.json();
        return weatherData;
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error");
      }
    },
  },
};

// mercuriu plugin
fastify.register(mercurius, {
  schema: typeDefs,
  resolvers: resolvers,
  graphiql: true, //use with localhost:8080/graphiql
});


//this dont work now
fastify.post("/api/getWeather", async (request, reply) => {

});

// Start the Fastify server
fastify.listen({ port: 8080 }, (err, address) => {
  if (err) throw err;
  console.log(`Server listening on ${address}`);
});
