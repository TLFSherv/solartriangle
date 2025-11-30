import React, { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";
import { data as calcData } from "../test-data/data";

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
    })

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



