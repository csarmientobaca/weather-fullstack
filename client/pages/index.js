"use client"
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  long: z.string(),
});

export default function index() {

  const [weatherobj, setWeatherobj] = useState({})

  //defining the default values of the form inputs
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
        throw new Error("the API failed");
      }

      const weatherData = await response.json();
      //changes "{}" to the weatherData
      setWeatherobj(weatherData);
      console.log("Weather Array:", weatherData.weather);
    } catch (error) {
      console.error(error);
    }
  }



  useEffect(() => {
    console.log("this is weatherobj:", weatherobj);
  }, [weatherobj]);

  useEffect(() => {
    if (Object.keys(weatherobj).length !== 0) {
      console.log("this is weatherobj:", weatherobj.weather);
    }
  }, [weatherobj]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* if the weatherobj is without data show the form, if not the show the data inside the weather obj */}
      {Object.keys(weatherobj).length !== 0 ? (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{ }</CardTitle>
              <Avatar>
                <AvatarImage src={`https://openweathermap.org/img/wn/${weatherobj.weather[0].icon}@2x.png`} />
                <AvatarFallback>weatherIcon</AvatarFallback>
              </Avatar>
              <CardDescription>Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
          <h1>
            {JSON.stringify(weatherobj.main)}
          </h1>
        </div>
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