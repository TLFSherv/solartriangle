'use server'
import { fetchWeatherApi } from "openmeteo";
import redis from 'redis'
import { redirect, RedirectType } from 'next/navigation'
import { type CalculatorData, type FormInputs, type SolarArray } from "@/app/types/types";
import z from 'zod';
import { verifySession } from "@/app/lib/session";
import { getSolarArrays } from "@/app/lib/dal";

type SolarAPIParams = {
    lat: string;
    lng: string;
    capacity: number;
    quantity: number;
    azimuth: number;
    tilt: number;
}

const calculatorSchema = z.object({
    address: z.string().nonempty("no address"),
    lat: z.string().nonempty("no latitude"),
    lng: z.string().nonempty("no longitude"),
    solarArrays: z.array(z.object({
        id: z.number(),
        solarCapacity: z.number().min(1),
        numberOfPanels: z.number().min(1),
        area: z.number().min(1).max(1000),
        azimuth: z.number().min(1),
        shape: z.array(z.object({ lat: z.number(), lng: z.number() }))
    })).min(1)
})


const revalidate = 600

// cache server function but revalidate data based on time
export async function fetchData(cacheData: CalculatorData) {
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

    try {
        let result: any[] = []
        for (const solarArray of cacheData.solarArrays) {
            const data = {
                lat: cacheData.lat,
                lng: cacheData.lng,
                capacity: solarArray.solarCapacity / 1000 * solarArray.numberOfPanels,
                quantity: solarArray.numberOfPanels,
                azimuth: solarArray.azimuth,
                tilt: 30
            };
            const pvwatts = await fetchPVWattsData(data);
            const openmeteo = await fetchOpenMetoData(data);
            result.push({ pvwatts, openmeteo })
        }
        return {
            success: true,
            data: result,
            error: ''
        };

    } catch (e: any) {
        // redirect to calculator page
        redirect('/calculator', RedirectType.replace)
    }
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
        // redirect to calculator page
        redirect('/calculator', RedirectType.replace)
    }
}

export async function cacheExists(key: string) {
    try {
        const redisClient = redis.createClient()
        redisClient.connect();
        const result = await redisClient.exists(key);
        return result;

    } catch (e) {
        console.error(e);
    }
}

// store form input data from calculator page in redis
export async function cacheData(key: string, data: CalculatorData) {
    try {
        const validationResult = z.safeParse(calculatorSchema, data);
        if (!validationResult.success)
            return {
                success: false,
                details: z.flattenError(validationResult.error)
            }
        const redisClient = redis.createClient();
        redisClient.connect();
        const result = await redisClient.setEx(key, 1800, JSON.stringify(data));
        if (result !== 'OK')
            throw Error(`Could not set value for key the ${key}, function returned: ${result}`);

        return {
            success: true,
            details: null
        };
    } catch (e: any) {
        return { success: false, details: e.message };
    }
}

export async function getCalculatorData(): Promise<FormInputs | undefined> {
    // check if user is logged in
    const session = await verifySession();
    if (session?.isAuth) {
        // send back users data if it exists
        const data = getSolarArrays(session.id);
        if (data) return data;
    }

    // send back cached data it it exists
    const exists = await cacheExists('calculatorData');
    if (!exists) return

    const cacheResult = await getCachedData('calculatorData');
    const data = cacheResult.data;
    return {
        address: data.address,
        location: new google.maps.LatLng(data.lat, data.lng),
        polygons: data.solarArrays.map(({ shape, id }: SolarArray) => {
            return {
                id,
                polygon: new google.maps.Polygon({
                    paths: shape,
                    strokeColor: id === 1 ? "#F0662A" : "#1E1E1E",
                    fillColor: "#444444",
                    fillOpacity: 0.25,
                    draggable: true,
                    editable: true,
                })
            }
        }),
        solarArrays: data.solarArrays
    }
}





