"use client"
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { TbTemperatureCelsius } from "react-icons/tb";
import { FaTemperatureArrowUp } from "react-icons/fa6";
import { FaTemperatureArrowDown } from "react-icons/fa6";
import { TbWorldLongitude } from "react-icons/tb";
import { TbWorldLatitude } from "react-icons/tb";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

//use for the form component shadcn
const formSchema = z.object({
  lat: z.string(),
  lon: z.string(),
});
import { useQuery, gql } from '@apollo/client';


const GET_COORDS = gql`
  query GetWeather($lat: Float!, $lon: Float!) {
    getWeather(lat: $lat, lon: $lon) {
      coord {
        lat
        lon
      }
    }
  }
`;

const GET_WEATHER = gql`
query GetWeather($lat: Float!, $lon: Float!) {
  getWeather(lat: $lat, lon: $lon) {
    weather {
      icon
      id
    }
  }
}
`;



///////function starts///////
export default function index() {
  const { loading: loadingCoords, error: errorCoords, data: dataCoords } = useQuery(GET_COORDS, {
    variables: { lat: 12, lon: 33 }
  });

  const { loading: loadingWeather, error: errorWeather, data: dataWeather } = useQuery(GET_WEATHER, {
    variables: { lat: 33, lon: 33 }
  });


  if (loadingCoords || loadingWeather) return <p>Loading...</p>;

  if (errorCoords || errorWeather) {
    return (
      <p>
        Error: {errorCoords ? errorCoords.message : errorWeather.message}
      </p>
    );
  }

  const { coord } = dataCoords.getWeather;
  const { weather } = dataWeather.getWeather;

//   //defining the default values of the form inputs
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lat: "",
      lon: "",
    },
  });


  return (
    <>
      <h1>
        Hello world coordinates:
        <br />lat {coord.lat}
        <br />lon {coord.lon}
      </h1>

      <h1>
        Hello world weather:
        {weather.map((w) => (
          <div key={w.id}>
            <br />id {w.id}
            <br />icon {w.icon}
          </div>
        ))}
      </h1>
      <Card className="space-y-4 w-80 text-center bg-blue-100">
        <CardHeader className="flex items-center justify-center flex-col">
                        <CardTitle>{weatherobj.name.trim() !== "" ? weatherobj.name : "nothing/no city"}</CardTitle>

                   {/* in this avatar the link is an image that the API provides too */}
                       <Avatar className="mt-2">
                          <AvatarImage src={`https://openweathermap.org/img/wn/${weatherobj.weather[0].icon}@2x.png`} />
                        <AvatarFallback>weatherIcon</AvatarFallback>
                         </Avatar>
                      <CardDescription>
                     </CardDescription>
                         <CardDescription className="flex items-center">
                           <TbWorldLatitude />
                           <p className="ml-1">Latitude: {weatherobj.coord.lat}</p>
                           <TbWorldLongitude className="ml-2" />
                           <p className="ml-1">Longitude: {weatherobj.coord.lon}</p>
                         </CardDescription>
                       </CardHeader>

                       <CardFooter className="flex items-center justify-center">
                         <p>
                           {weatherobj.main.temp}
                         </p>
                         <TbTemperatureCelsius />
                       </CardFooter>
                       <CardFooter className="flex items-center justify-center">
                         <FaTemperatureArrowDown />
                         <p>
                           MIN {weatherobj.main.temp_min}
                         </p>
                         <TbTemperatureCelsius />
                       </CardFooter>
                       <CardFooter className="flex items-center justify-center">
                         <FaTemperatureArrowUp />
                         <p>
                           MAX {weatherobj.main.temp_max}
                         </p>
                         <TbTemperatureCelsius />
                       </CardFooter>
                     </Card>
    </>
  )
}

//   const [weatherobj, setWeatherobj] = useState({})

//   const baseUrl = "http://localhost:8080/api/getWeather?"


//       const weatherData = await response.json();
//       //changes "{}" to the weatherData
//       setWeatherobj(weatherData);
//       console.log("Weather Array:", weatherData.weather);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   useEffect(() => {
//     if (Object.keys(weatherobj).length !== 0) {
//       console.log("this is weatherobj:", weatherobj.weather);
//     }
//   }, [weatherobj]);

//   //function to clean reset the weatherobj and clean the inputs
//   const onHomeButtonClick = () => {
//     setWeatherobj({});
//     form.reset();
//   };
//   return (
//     <>
//       <div className="flex min-h-screen flex-col items-center justify-between p-20">
//         {/* if the weatherobj is without data show the form, if not the show the data inside the weather obj, rendering con */}
//         {Object.keys(weatherobj).length !== 0 ? (
//           <div>
//             <div className="text-center">
//               <Button onClick={onHomeButtonClick}>
//                 Home
//               </Button>
//             </div>
//
//           </div>
//         ) : (
//           // this form s how it start, when the weatherobj has nothing saved
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <FormField
//                 control={form.control}
//                 name="lat"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Latitude</FormLabel>
//                     <FormControl>
//                       {/* the latitud is min -90 and max 90 */}
//                       <Input type="number" step="any" min="-90" max="90" placeholder="41.90" {...field} />
//                     </FormControl>
//                     <FormDescription>This is the Latitude field.</FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="lon"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Longitude</FormLabel>
//                     <FormControl>
//                       {/* the longitude is min -180 and max 180 */}
//                       <Input type="number" step="any" min="-180" max="180" placeholder="12.49" {...field} />
//                     </FormControl>
//                     <FormDescription>This is the Longitude field.</FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit">Get Weather</Button>
//             </form>
//           </Form>
//         )}
//       </div>
//     </>
//   );
// }