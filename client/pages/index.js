"use client"// Your frontend component file (e.g., pages/index.js)
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


const formSchema = z.object({
  lat: z.string().min(2, {
    message: "The must be at least 2 characters.",
  }),
  long: z.string(),
});

export default function index() {
  const [weatherobj, setWeatherobj] = useState({})

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lat: "",
      long: "",
    },
  });
  const baseUrl = "http://localhost:8080/api/getWeather?"

  async function onSubmit(data) {
    try {
      console.log(data)
      const response = await fetch(baseUrl + `lat=${data.lat}&lon=${data.long}`,
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            lat: data.lat,
            long: data.long,
          })
        })

      if (!response.ok) {
        throw new Error("Weather API request failed");
      }

      const weatherData = await response.json();
      setWeatherobj(weatherData);
      console.log("Weather Array:", weatherData.weather);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    console.log("this is weatherobj:", weatherobj.weather);
  }, [weatherobj]);

  useEffect(() => {
    if (Object.keys(weatherobj).length !== 0) {
      console.log("this is weatherobj:", weatherobj.weather);
    }
  }, [weatherobj]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {Object.keys(weatherobj).length !== 0 ? (
        <h1>
          {JSON.stringify(weatherobj.main)}
        </h1>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="41.90" {...field} />
                  </FormControl>
                  <FormDescription>This is the Latitude field.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="long"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="12.49" {...field} />
                  </FormControl>
                  <FormDescription>This is the Longitude field.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Get Weather</Button>
          </form>
        </Form>
      )}
    </div>
  );
}