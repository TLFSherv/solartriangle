import React, { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";

type ParamObj = {
    lat: string;
    lng: string;
    capacity: string;
    azimuth: number;
    tilt: number;
}

type Panel = {
    polygon: {
        lat: number;
        lng: number;
    }[];
    area: number;
    azimuth: number;
}

const calcData = {
    "address": "8 Link Ln",
    "lat": "32.3452828",
    "lng": "-64.7250711",
    "area": "64.48",
    "azimuth": "13.93",
    "capacity": "400",
    "quantity": "4",
    "panels": [
        {
            "polygon": [
                {
                    "lat": 32.345340846769375,
                    "lng": -64.72521228835394
                },
                {
                    "lat": 32.345379287436394,
                    "lng": -64.72504042364962
                },
                {
                    "lat": 32.34534067499894,
                    "lng": -64.72502904849897
                },
                {
                    "lat": 32.34529873970741,
                    "lng": -64.72519781087718
                }
            ],
            "area": 77.4,
            "azimuth": 15.65
        },
        {
            "polygon": [
                {
                    "lat": 32.34527444921581,
                    "lng": -64.72518643573893
                },
                {
                    "lat": 32.34530502704261,
                    "lng": -64.72503421902873
                },
                {
                    "lat": 32.3452672882259,
                    "lng": -64.72502491208728
                },
                {
                    "lat": 32.345234963080564,
                    "lng": -64.72517402647883
                }
            ],
            "area": 64.48,
            "azimuth": 13.93
        }
    ]
}

export default function useFetchData() {
    const [data, setData] = useState([]);
    // const [error, setError] = useState(null);

    // const calcDataStr = localStorage.getItem("calculatorData");
    // const calcData = JSON.parse(calcDataStr as string);

    const params = calcData.panels.map((panel: Panel) => {
        return {
            lat: calcData.lat,
            lng: calcData.lng,
            capacity: calcData.capacity,
            azimuth: panel.azimuth,
            tilt: 30
        }
    }) // parse userInputs

    useEffect(() => {
        const fetchData = async () => {
            let result: any = [];
            params.forEach(async (param) => {
                const pvWattsRes = await fetchPVWattsData(param);
                const openmeteoRes = await fetchOpenMetoData(param);

                result.push({ pvWattsRes, openmeteoRes });
            })
            setData(result);
        }

        try {
            fetchData();
        } catch (err) {
            console.log(err);
        }

    }, [])

    return { data }
}

const fetchPVWattsData = async (param: ParamObj) => {
    const api_key = process.env.NEXT_PUBLIC_NREL_API_KEY;
    const url = `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${api_key}&azimuth=${param.azimuth}&system_capacity=${param.capacity}&module_type=0&losses=14&array_type=1&tilt=${param.tilt}&lat=${param.lat}&lon=${param.lng}`;
    try {
        const res = await fetch(url);
        const json = await res.json();
        return json;

    } catch (err) {
        throw err;
    }
}

const fetchOpenMetoData = async (param: ParamObj) => {
    const fetchParams = {
        latitude: param.lat,
        longitude: param.lng,
        hourly: ["temperature_2m", "global_tilted_irradiance", "global_tilted_irradiance_instant"],
        tilt: param.tilt,
        azimuth: param.azimuth,
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    try {
        const responses = await fetchWeatherApi(url, fetchParams);
        const res = responses[0];
        const utcOffsetSeconds = res.utcOffsetSeconds();
        const hourly = res.hourly()!;

        // Note: The order of weather variables in the URL query and the indices below need to match!
        return {
            hourly: {
                time: Array.from(
                    { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
                    (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
                ),
                temperature_2m: hourly.variables(0)!.valuesArray(),
                global_tilted_irradiance: hourly.variables(1)!.valuesArray(),
                global_tilted_irradiance_instant: hourly.variables(2)!.valuesArray(),
            },
        };
    } catch (err) {
        throw err;
    }
}



