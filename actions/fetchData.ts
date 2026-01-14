'user server'
import { fetchWeatherApi } from "openmeteo";
import { inputs } from "../app/dashboard/test-data/data";

export const revalidate = 600

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
// chache server function but revalidate data based on time
export default async function fetchData() {
    const formDataStr = localStorage.getItem("calculatorData");
    const formData = JSON.parse(formDataStr as string);
    // const initParams = (): ParamObj[] => {
    //     return inputs.solarArrays.map((solarArray: SolarArray) => {
    //         return {
    //             lat: inputs.lat,
    //             lng: inputs.lng,
    //             capacity: (solarArray.solarCapacity / 1000) * solarArray.numberOfPanels,
    //             quantity: solarArray.numberOfPanels,
    //             azimuth: solarArray.azimuth,
    //             tilt: 30
    //         }
    //     })
    // }

    // const params = initParams();
    let result: any[] = []
    for (const data of formData) {
        const pvwatts = await fetchPVWattsData(data);
        const openmeteo = await fetchOpenMetoData(data);
        result.push({ pvwatts, openmeteo })
    }

    return result;;
}

const fetchPVWattsData = async (param: ParamObj) => {
    const api_key = process.env.NEXT_PUBLIC_NREL_API_KEY;
    const url = `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${api_key}&azimuth=${param.azimuth}&system_capacity=${param.capacity}&module_type=0&losses=14&array_type=1&tilt=${param.tilt}&lat=${param.lat}&lon=${param.lng}&timeframe=hourly`;
    try {
        const response = await fetch(url, { next: { revalidate: 600 } });
        const json = await response.json();
        return json;

    } catch (err) {
        throw err;
    }
}

const fetchOpenMetoData = async (param: ParamObj) => {
    const fetchParams = {
        latitude: param.lat,
        longitude: param.lng,
        hourly: ["temperature_2m", "global_tilted_irradiance", "wind_speed_10m"],
        timezone: 'GMT-4',
        tilt: param.tilt,
        azimuth: param.azimuth > 180 ? param.azimuth - 360 : param.azimuth, // convert to range -180 to 180 degrees
        past_days: 3,
        forecast_minutely_15: 96 // the number of 15min time steps the data is controlled
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
                wind_speed_10m: hourly.variables(2)!.valuesArray(),
            },
        };
    } catch (err) {
        throw err;
    }
}



