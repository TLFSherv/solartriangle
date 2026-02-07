'use server'
import { fetchWeatherApi } from "openmeteo";
import { myRedisClient } from "@/app/lib/redis";
import { redirect, RedirectType } from 'next/navigation'
import { headers } from "next/headers";
import { z } from 'zod';
import { $ZodError } from "zod/v4/core";
import { verifySession } from "@/app/lib/session";
import { insertPolygonSchema, insertSolarArraySchema, NewSolarArray, NewPolygon, NewAddress } from "../src/db/schema";
import { getSolarArrays, dbUpdate, dbInsert, dbDelete } from "@/app/lib/dal";
import { type CalculatorData, type SolarArray, type SolarAPIParams } from "@/app/types/types";
import { rateLimiter } from '@/app/lib/rate-limiter'
import { RateLimiterRes } from "rate-limiter-flexible";

type DatabaseData = { solarArrays: NewSolarArray; polygons: NewPolygon; addresses: NewAddress };

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
export async function fetchDashboardData(inputData: CalculatorData) {
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
        const identifier = await getIdentifier() as string;
        // check rate limiter before doing work
        await rateLimiter.consume(identifier); //throws rate limit error if exceeded

        // rate limit passed
        let result: any[] = []

        for (const solarArray of inputData.solarArrays) {
            const inputs = {
                lat: inputData.lat,
                lng: inputData.lng,
                capacity: (solarArray.solarCapacity * solarArray.numberOfPanels) / 1000, // kW
                quantity: solarArray.numberOfPanels,
                azimuth: solarArray.azimuth,
                tilt: 30
            };
            const pvwatts = await fetchPVWattsData(inputs);
            const openmeteo = await fetchOpenMetoData(inputs);
            result.push({ pvwatts, openmeteo })
        }
        return {
            success: true,
            data: result,
            error: ''
        };

    } catch (e: any) {
        if (e instanceof RateLimiterRes) {
            // Rate limit exceeded
            const retryAfter = Math.ceil(e.msBeforeNext / 1000);
            return {
                error: `Too many requests`,
                retryAfter,
                remainingPoints: e.remainingPoints
            }
        }
        console.log(e.message);
        // redirect to calculator page
        redirect('/calculator', RedirectType.replace)
    }
}

// Get form input data from Redis
export async function getInputsFromCache() {
    try {
        if (!myRedisClient) throw Error('Error connecting to redis client');

        const identifier = await getIdentifier();
        const inputKey = `user-input:${identifier}`;
        const data = await myRedisClient.get(inputKey);

        if (!data) throw Error(`Could not find value`);

        return {
            success: true,
            data: JSON.parse(data),
            error: ''
        };
    } catch (e: any) {
        // redirect to calculator page
        console.log(e.message);
        redirect('/calculator', RedirectType.replace)
    }
}

// Check if there's data in Redis
export async function cacheExists(key?: string) {
    try {
        if (!myRedisClient) throw Error('Error connecting to redis client');

        const identifier = await getIdentifier();
        const inputKey = key ?? `user-input:${identifier}`;
        return await myRedisClient.exists(inputKey) > 0;
    } catch (e) {
        console.error(e);
    }
}

//Get key for the value stored in Redis
async function getIdentifier() {
    try {
        const headerList = headers();
        let identifier: string;
        const session = await verifySession();
        // check if user is logged in
        if (session?.isAuth) {
            identifier = `user:${session.id}`;
        } else {
            const forwarded = (await headerList).get('x-forwarded-for') ?? '127.0.0.1';
            const ip = forwarded.split(',')[0].trim();
            identifier = `ip:${ip}`;
        }
        return identifier;
    } catch (e: any) {
        console.log(e.message);
    }
}

// Store input data from calculator page in Redis
export async function storeInputsInCache(data: CalculatorData) {
    try {
        const validationResult = z.safeParse(calculatorSchema, data);
        if (!validationResult.success)
            return {
                success: false,
                details: z.flattenError(validationResult.error)
            }

        if (!myRedisClient) throw Error('Error connecting to redis client');

        const identifier = await getIdentifier();
        const inputKey = `user-input:${identifier}`;
        const result = await myRedisClient.setEx(inputKey, 1800, JSON.stringify(data));

        if (result !== 'OK')
            throw Error(`Could not set value`);

        return {
            success: true,
            details: null
        };
    } catch (e: any) {
        return { success: false, details: e.message };
    }
}

// Format data from database to be displayed on calculator page
function formatInputs(data: DatabaseData[]): CalculatorData {
    const solarArrays: SolarArray[] = [];
    data.forEach(d => {
        const path = JSON.parse(d.polygons.coords);
        const { name: id, capacity, quantity } = d.solarArrays;
        const { area, azimuth } = d.polygons
        solarArrays.push({
            id: parseInt(id),
            solarCapacity: capacity,
            numberOfPanels: quantity as number,
            area: parseInt(area as string),
            azimuth: parseInt(azimuth as string),
            shape: path,
            areaToPanels: false
        })
    });

    const { name: address, latitude: lat, longitude: lng } = data[0].addresses;
    return { address, lat, lng, solarArrays }
}

// Get input data from database if user has an account
export async function readInputsFromDb(): Promise<{ isAuth: boolean; data: CalculatorData | null }> {
    try {
        // check if user is logged in
        const session = await verifySession();

        // if user is logged in check if they have data in the database
        if (session?.isAuth) {
            const { success, data } = await getSolarArrays(session.id);
            return { isAuth: true, data: (data && data.length > 0) ? formatInputs(data) : null };
        }

        // if user is not logged in check cache for data
        const exists = await cacheExists();
        if (!exists) return { isAuth: false, data: null }

        const data = (await getInputsFromCache()).data;
        return {
            isAuth: false,
            data: {
                address: data.address,
                lat: data.lat,
                lng: data.lng,
                solarArrays: data.solarArrays
            }
        }
    } catch (e) {
        return { isAuth: false, data: null }
    }
}

// Store/update input data in database if user has an account
export async function storeInputsInDb(address: string, lat: string, lng: string, solarArrays: SolarArray[]) {
    const newData: CalculatorData = {
        address: address,
        lat: lat,
        lng: lng,
        solarArrays: solarArrays
    };

    try {
        // validate form data
        const validationResult = z.safeParse(calculatorSchema, newData);
        if (!validationResult.success) return {
            success: false,
            details: z.flattenError(validationResult.error)
        }

        // get user id
        const session = await verifySession();
        if (!session?.isAuth) return { success: false, details: 'User is not logged in' };
        const userId = session.id;

        // get data for user
        const { success, data: currentData } = await getSolarArrays(userId);
        if (!success) throw Error('Error getting data');

        const currentDataIds = currentData.map(data => data.solarArrays.name);
        const newDataIds: string[] = [];

        // loop through all of the users solar arrays
        for (let i = 0; i < newData.solarArrays.length; i++) {
            let {
                id,
                solarCapacity,
                numberOfPanels,
                area,
                azimuth,
                shape
            } = newData.solarArrays[i];
            newDataIds.push(id.toString());

            const index = currentData.findIndex(d => d.solarArrays.name === id.toString());

            const solarArray: NewSolarArray = {
                id: currentData[index]?.solarArrays.id,
                name: id.toString(),
                capacity: solarCapacity,
                quantity: numberOfPanels,
                userId: userId,
                addressId: currentData[index]?.addresses.id,
                polygonId: currentData[index]?.polygons.id,
                lastModified: new Date(),
                dateCreated: currentData[index]?.solarArrays.dateCreated || undefined
            }
            const polygon: NewPolygon = {
                coords: JSON.stringify(shape),
                area: area.toString(),
                azimuth: azimuth.toString(),
                numberOfPoints: shape.length
            }
            const address: NewAddress = {
                name: newData.address,
                latitude: newData.lat,
                longitude: newData.lng
            }

            const polygonValidation = z.safeParse(insertPolygonSchema, polygon);
            const solarArrayValidation = z.safeParse(insertSolarArraySchema, solarArray);
            if (!polygonValidation.success || !solarArrayValidation.success)
                return {
                    success: false,
                    message: 'validation failed',
                    error: !polygonValidation.success ?
                        z.flattenError(polygonValidation.error).fieldErrors :
                        z.flattenError(solarArrayValidation.error as $ZodError).fieldErrors
                }

            // update/insert data
            const { success, error } = (currentDataIds.includes(newDataIds[i])) ?
                await dbUpdate(userId, solarArray, polygon) :
                await dbInsert(solarArray, polygon, address);

            if (!success) throw Error(error);
        }

        // delete old data
        for (let i = 0; i < currentData.length; ++i) {
            const { name, id } = currentData[i].solarArrays;
            if (!newDataIds.includes(name)) {
                const { success } = await dbDelete(id, userId);
                if (!success) throw Error('Error with delete');
            }
        }
        return { success: true, message: 'data saved successfully', error: '' };
    } catch (e: any) {
        return { success: false, message: 'data failed to save', error: e.message };
    }
}





