"use client"
import React, { useState } from 'react'

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
} from "@/components/ui/form"

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
import { useLazyQuery, gql } from '@apollo/client';

const GET_ALL = gql`
query GetWeather($lat: Float!, $lon: Float!){
  getWeather(lat: $lat, lon: $lon) {
    name
    weather{
      id
      icon
      description
    }
    coord{
      lat
      lon
    }
    main{
      temp
      temp_min
      temp_max
    }
  }
}
`
///////FUN starts///////
export default function index() {

  const [weatherData, setWeatherData] = useState({});

  //defining the default values of the form inputs
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lat: "",
      lon: "",
    },
  });


  const [getWeather, { loading: loadingAll, error: errorAll }] = useLazyQuery(GET_ALL, {
    onCompleted: (data) => {
      setWeatherData(data?.getWeather || {});
    },
  });

  const onSubmit = (formData) => {
    const { lat, lon } = formData;

    // Trigger the query with the new variables
    getWeather({ variables: { lat: parseFloat(lat), lon: parseFloat(lon) } });
  };

  if (errorAll) {
    return (
      <p>
        Error: {errorAll.message}
      </p>
    );
  }

  const { name, weather, coord, main } = weatherData

  const onHomeButtonClick = () => {
    setWeatherData({});
    form.reset();
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between p-20">
        {Object.keys(weatherData).length !== 0 ? (
          <div>
            <div>
              <div className="text-center">
                <Button onClick={onHomeButtonClick}>
                  Home
                </Button>
              </div>
            </div>
            <Card className="space-y-4 w-80 text-center bg-blue-100">
              <CardHeader className="flex items-center justify-center flex-col">
                <CardTitle>{name.trim() !== "" ? name : "nothing/no city"}</CardTitle >
                {/* in this avatar the link is an image that the API provides too */}
                < Avatar className="mt-2" >
                  <AvatarImage src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`} />
                  <AvatarFallback>weatherIcon</AvatarFallback>
                </Avatar >
                <CardDescription>
                  {weather[0].description}
                </CardDescription>
                <CardDescription className="flex items-center">
                  <TbWorldLatitude />
                  <p className="ml-1">Latitude: {coord.lat}</p>
                  <TbWorldLongitude className="ml-2" />
                  <p className="ml-1">Longitude: {coord.lon}</p>
                </CardDescription>
              </CardHeader >

              <CardFooter className="flex items-center justify-center">
                <p>
                  {main.temp}
                </p>
                <TbTemperatureCelsius />
              </CardFooter>
              <CardFooter className="flex items-center justify-center">
                <FaTemperatureArrowDown />
                <p>
                  MIN {main.temp_min}
                </p>
                <TbTemperatureCelsius />
              </CardFooter>
              <CardFooter className="flex items-center justify-center">
                <FaTemperatureArrowUp />
                <p>
                  MAX {main.temp_max}
                </p>
                <TbTemperatureCelsius />
              </CardFooter>
            </Card >
          </div>
        )
          :
          (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input required type="number" step="any" min="-90" max="90" placeholder="41.90" {...field} />
                      </FormControl>
                      <FormDescription>This is the Latitude field.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input required type="number" step="any" min="-180" max="180" placeholder="12.49" {...field} />
                      </FormControl>
                      <FormDescription>This is the Longitude field.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disable type="submit">Get Weather</Button>
              </form>
            </Form >
          )
        }
      </div>
    </>
  )
}