import { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";
import { data } from "../test-data/data";

type ParamObj = {
    lat: string;
    lng: string;
    capacity: number;
    quantity: number;
    azimuth: number;
    tilt: number;
}

type SolarArray = {
    id: number;
    solarCapacity: number;
    numberOfPanels: number;
    area: number;
    azimuth: number;
    shape: { lat: number; lng: number; }[];
}

export default function useFetchData() {
    const [result, setResult] = useState([]);
    // const [error, setError] = useState(null);

    // const formDataStr = localStorage.getItem("calculatorData");
    // const formData = JSON.parse(formDataStr as string);

    useEffect(() => {
        function initInputData(): ParamObj[] {
            return data.solarArrays.map((solarArray: SolarArray) => {
                return {
                    lat: data.lat,
                    lng: data.lng,
                    capacity: solarArray.solarCapacity,
                    quantity: solarArray.numberOfPanels,
                    azimuth: solarArray.azimuth,
                    tilt: 30
                }
            })
        }

        try {
            const fetchData = async () => {
                let result: any = [];
                let apiParams = initInputData();

                apiParams.forEach(async (param) => {
                    const pvWattsResult = await fetchPVWattsData(param);
                    const openmeteoResult = await fetchOpenMetoData(param);

                    result.push({ pvWattsResult, openmeteoResult });
                })
                setResult(result);
            }

            fetchData();
        } catch (err) {
            console.log(err);
        }

    }, [])

    return { result }
}

const fetchPVWattsData = async (param: ParamObj) => {
    const api_key = process.env.NEXT_PUBLIC_NREL_API_KEY;
    const url = `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${api_key}&azimuth=${param.azimuth}&system_capacity=${param.capacity}&module_type=0&losses=14&array_type=1&tilt=${param.tilt}&lat=${param.lat}&lon=${param.lng}&timeframe=hourly`;
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
        timezone: 'AST',
        tilt: param.tilt,
        azimuth: param.azimuth > 180 ? param.azimuth - 360 : param.azimuth, // convert to range -180 to 180 degrees
        past_days: 3,
        forecast_minutely_15: 96
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



