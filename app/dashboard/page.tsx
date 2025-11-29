"use client"
import { useSearchParams } from "next/navigation"
import React, { useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";

export default function Dashboard() {
    const params = {
        address: "8 Link Ln",
        lat: "32.3452828",
        lng: "-64.7250711",
        area: "42",
        azimuth: "16",
        capacity: "400",
        quantity: "4",
        tilt: "30"
    };
    let pvWattsData;
    let openMeteoData;
    useEffect(() => {
        const calculatorData = localStorage.getItem("calculatorData");
        console.log(calculatorData)
        // const fetchPVWattsData = async () => {
        //     const api_key = process.env.NEXT_PUBLIC_NREL_API_KEY;
        //     const url = `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${api_key}&azimuth=${params.azimuth}&system_capacity=${params.capacity}&module_type=0&losses=14&array_type=1&tilt=${params.tilt}&lat=${params.lat}&lon=${params.lng}`;
        //     let result;
        //     try {
        //         const resp = await fetch(url);
        //         result = await resp.json();

        //     } catch (err) {
        //         console.log(err);
        //     }

        //     console.log(result);
        //     return result;
        // }

        // const fetchOpenMetoData = async () => {
        //     const fetchParams = {
        //         latitude: params.lat,
        //         longitude: params.lng,
        //         hourly: ["temperature_2m", "global_tilted_irradiance", "global_tilted_irradiance_instant"],
        //         tilt: params.tilt,
        //         azimuth: params.azimuth,
        //     };
        //     const url = "https://api.open-meteo.com/v1/forecast";
        //     const responses = await fetchWeatherApi(url, fetchParams);
        //     const response = responses[0];
        //     const utcOffsetSeconds = response.utcOffsetSeconds();
        //     const hourly = response.hourly()!;

        //     // Note: The order of weather variables in the URL query and the indices below need to match!
        //     const weatherData = {
        //         hourly: {
        //             time: Array.from(
        //                 { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
        //                 (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        //             ),
        //             temperature_2m: hourly.variables(0)!.valuesArray(),
        //             global_tilted_irradiance: hourly.variables(1)!.valuesArray(),
        //             global_tilted_irradiance_instant: hourly.variables(2)!.valuesArray(),
        //         },
        //     };

        //     // The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
        //     console.log("\nHourly data:\n", weatherData.hourly)
        // }

        // pvWattsData = fetchPVWattsData();
        // openMeteoData = fetchOpenMetoData();
    }, [])

    return (
        <>
            <h1>Anonymous users dashboard</h1>
            <h1>{params['address']}</h1>
        </>
    )
}



