'use server'
import { fetchWeatherApi } from "openmeteo";
import { inputs } from "../app/dashboard/test-data/data";
import redis from 'redis'

type SolarAPIParams = {
    lat: string;
    lng: string;
    capacity: number;
    quantity: number;
    azimuth: number;
    tilt: number;
}

const revalidate = 600

// cache server function but revalidate data based on time
export async function fetchData() {
    const fetchPVWattsData = async (param: SolarAPIParams) => {
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

    const fetchOpenMetoData = async (param: SolarAPIParams) => {
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
    const cachedObj = await getCachedData("calculatorData");
    if (!cachedObj.success) throw Error(cachedObj.error);

    let result: any[] = []
    for (const solarArray of cachedObj.data.solarArrays) {
        const data = {
            lat: cachedObj.data.lat,
            lng: cachedObj.data.lng,
            capacity: solarArray.solarCapacity,
            quantity: solarArray.numberOfPanels,
            azimuth: solarArray.azimuth,
            tilt: 30
        };
        const pvwatts = await fetchPVWattsData(data);
        const openmeteo = await fetchOpenMetoData(data);
        result.push({ pvwatts, openmeteo })
    }

    return result;
}
// fetch form data from redis
export async function getCachedData(key: string) {
    try {
        const redisClient = redis.createClient()
        redisClient.connect();
        const data = await redisClient.get(key);

        if (!data) throw Error(`Could not find value for the key ${key}`);

        return {
            success: true,
            data: JSON.parse(data),
            error: ''
        };
    } catch (e: any) {
        console.error(e);
        return {
            success: false,
            data: null,
            error: e.message
        };
    }
}
// store form input data from calculator page in redis
export async function cacheData(key: string, data: string) {
    try {
        const redisClient = redis.createClient();
        redisClient.connect();
        const result = await redisClient.setEx(key, 1800, data);
        if (result !== 'OK')
            throw Error(`Could not set value for key the ${key}, function returned: ${result}`);

        return {
            success: true,
            error: ''
        };
    } catch (e: any) {
        console.error(e);
        return {
            success: false,
            error: e.message
        };
    }
}





