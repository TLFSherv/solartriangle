'use server'

import { myRedisClient } from "@/app/lib/redis";
import { redirect, RedirectType } from 'next/navigation'
import { headers } from "next/headers";
import { z } from 'zod';
import { $ZodError } from "zod/v4/core";
import { verifySession } from "@/app/lib/session";
import {
    insertPolygonSchema, insertSolarArraySchema,
    type NewSolarArray, type NewPolygon, type NewAddress,
    type NewCountry, type Country,
    insertAddressSchema
} from "../src/db/schema";
import { getUserSolarData, updateUserSolarData, insertUserSolarData, deleteUserSolarData, getCountries } from "@/app/lib/dal";
import { rateLimiter } from '@/app/lib/rate-limiter'
import { RateLimiterRes } from "rate-limiter-flexible";
import { getPVWattsData, getOpenMetoData } from "@/services/api";
import { type CalculatorData } from "@/app/types/types";
import { type UserSolarData } from "@/app/types/dto";

const calculatorSchema = z.object({
    location: z.object({
        country: z.string().nonempty("no country"),
        countryCode: z.string().nonempty("no country code"),
        countryCoords: z.object({
            lat: z.float32().nonoptional(),
            lng: z.float32().nonoptional(),
        }).nonoptional("no country"),
        timeZone: z.string().nonempty("no time zone"),
        address: z.string().nonempty("no address"),
        addressCoords: z.object({
            lat: z.float32().nonoptional(),
            lng: z.float32().nonoptional(),
        }).nonoptional({ error: "no address selected from dropdown" })
    }),
    solarArrays: z.array(z.object({
        id: z.number({ error: "no address" }),
        capacity: z.number().min(1, { error: "no capacity" }),
        quantity: z.number().min(1, { error: "no quantity" }),
        area: z.number().min(1, { error: "no area" }).max(1000, { error: "area must be less than 1000" }),
        azimuth: z.number().min(1, { error: "no azimuth" }),
        shape: z.array(z.object({ lat: z.number(), lng: z.number() })).min(1, { error: "no polygons" }),
        areaToQuantity: z.boolean().optional()
    })).min(1, { error: "Please add one or more polygons to the map." })
})
type DbData = {
    solarArrays: NewSolarArray;
    polygons: NewPolygon;
    addresses: NewAddress;
    countries: NewCountry;
};

type fieldErrors = {
    address?: string[] | undefined;
    lat?: string[] | undefined;
    lng?: string[] | undefined;
    solarArrays?: string[] | undefined;
}

type DataResult<T> = { data: T; error: null } |
{
    data: null; error: {
        message: string;
        zodError?: { location?: string[] | undefined; solarArrays?: string[] | undefined; }
    }
}

const revalidate = 600

// cache server function but revalidate data based on time
export async function getDashboardData(input: CalculatorData):
    Promise<DataResult<any>> {
    try {
        const identifier = await getIdentifier();
        if (identifier.error) throw Error(identifier.error.message);
        // check rate limiter before doing work
        await rateLimiter.consume(identifier.data); //throws rate limit error if exceeded

        // rate limit passed
        let dashboardData: any[] = []
        for (const { capacity, quantity, azimuth } of input.solarArrays) {
            const apiInputs = {
                lat: input.location.addressCoords.lat.toString(),
                lng: input.location.addressCoords.lng.toString(),
                capacity: (capacity * quantity) / 1000, // kW
                quantity,
                azimuth,
                tilt: 30,
                timeZone: input.location.timeZone
            };
            const pvwatts = await getPVWattsData(apiInputs);
            const openmeteo = await getOpenMetoData(apiInputs);
            dashboardData.push({ pvwatts, openmeteo })
        }
        return { data: dashboardData, error: null };

    } catch (e: any) {
        if (e instanceof RateLimiterRes) {
            // Rate limit exceeded
            const retryAfter = Math.ceil(e.msBeforeNext / 1000);
            return {
                data: null,
                error: {
                    message: `Too many requests. Retry after ${retryAfter} seconds. Remaining points ${e.remainingPoints}.`
                }
            }
        }
        // redirect to calculator page
        redirect('/calculator', RedirectType.replace)
    }
}

// Get form input data from Redis
export async function getCachedCalculatorData(): Promise<DataResult<CalculatorData>> {
    try {
        if (!myRedisClient) throw Error('Error connecting to redis client');

        const identifier = await getIdentifier();
        if (identifier.error) throw Error(identifier.error.message);

        const inputKey = `user-input:${identifier.data}`;
        const data = await myRedisClient.get(inputKey);

        if (!data) throw Error("Could not find value");

        return { data: JSON.parse(data), error: null };
    } catch (e: any) {
        // redirect to calculator page
        console.log(e.message);
        redirect('/calculator', RedirectType.replace)
    }
}

// Check if there's data in Redis
export async function isDataInCache(key?: string): Promise<DataResult<boolean>> {
    try {
        if (!myRedisClient) throw Error('Error connecting to redis client');

        const identifier = await getIdentifier();
        if (identifier.error) throw Error(identifier.error.message);

        const inputKey = key ?? `user-input:${identifier.data}`;
        const result = await myRedisClient.exists(inputKey) > 0;
        return { data: result, error: null }
    } catch (e: any) {
        return { data: null, error: { message: e.message } }
    }
}

//Get key for the value stored in Redis
async function getIdentifier(): Promise<DataResult<string>> {
    try {
        let identifier;
        const headerList = headers();
        const session = await verifySession();
        // check if user is logged in
        if (session?.isAuth) {
            identifier = `user:${session.id}`;
        } else {
            const forwarded = (await headerList).get('x-forwarded-for') ?? '127.0.0.1';
            const ip = forwarded.split(',')[0].trim();
            identifier = `ip:${ip}`;
        }
        return { data: identifier, error: null };
    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

export async function isLoggedIn(): Promise<DataResult<boolean>> {
    try {
        const result = await verifySession();
        return { data: result?.isAuth || false, error: null }
    } catch (e: any) {
        return { data: null, error: { message: e.message } }
    }

}

export async function getCountryData(): Promise<DataResult<Country[]>> {
    try {
        let countryData: Country[];

        // retrieve country data from cache
        const key = 'countryDropdownData';
        const isDataInCache = await myRedisClient?.exists(key);
        if (isDataInCache && isDataInCache > 0) {
            let data = await myRedisClient?.get(key);

            if (!data) throw new Error("Error reading from cache");
            countryData = JSON.parse(data);
            return { data: countryData, error: null };
        }

        // get country data from database
        let result = await getCountries();
        if (result.error) throw new Error(result.error.message);
        countryData = result.data as Country[];

        // store data in cache
        await myRedisClient?.setEx(key, 1800, JSON.stringify(countryData));
        return { data: countryData, error: null }

    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

// Store input data from calculator page in Redis
export async function cacheCalculatorData(input: CalculatorData) {
    try {
        const validationResult = z.safeParse(calculatorSchema, input);
        if (!validationResult.success)
            return {
                data: false,
                error: { message: z.flattenError(validationResult.error) }
            }

        if (!myRedisClient) throw Error('Error connecting to redis client');

        const identifier = await getIdentifier();
        if (identifier.error) throw Error(identifier.error.message);

        const inputKey = `user-input:${identifier.data}`;
        const result = await myRedisClient.setEx(inputKey, 1800, JSON.stringify(input));

        if (result !== 'OK') throw Error("Could not set value");

        return { data: true, error: null };
    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

// Format data from database to be displayed on calculator page
function formatData(input: DbData[]): CalculatorData {
    const solarArrays = input.map(({ polygons, solarArrays }) => {
        const path = JSON.parse(polygons.coords);
        return {
            id: parseInt(solarArrays.name),
            capacity: solarArrays.capacity,
            quantity: solarArrays.quantity as number,
            area: parseInt(polygons.area as string),
            azimuth: parseInt(polygons.azimuth as string),
            shape: path,
            areaToQuantity: false
        }
    });

    const { countries, addresses } = input[0];
    const location = {
        country: countries.name,
        countryCode: countries.code,
        countryCoords: {
            lat: parseFloat(countries.latitude),
            lng: parseFloat(countries.longitude),
        },
        timeZone: countries.timeZone,
        address: addresses.name,
        addressCoords: {
            lat: parseFloat(addresses.latitude),
            lng: parseFloat(addresses.longitude),
        }
    };

    return { location, solarArrays }
}

// Get input data from database if user has an account
export async function getCalculatorData(): Promise<DataResult<CalculatorData | null>> {
    try {
        // check if user is logged in
        const session = await verifySession();

        // if user is logged in check if they have data in the database
        if (session?.isAuth) {
            const result = await getUserSolarData(session.id);
            if (result.error) throw Error(result.error.message)

            return { data: formatData(result.data), error: null };
        }

        // check if there's data in cache
        const dataExists = await isDataInCache();
        if (dataExists.error) throw Error(dataExists.error.message);
        else if (!dataExists.data) return { data: null, error: null }

        const result = await getCachedCalculatorData();
        if (result.error) throw Error(result.error.message);

        return {
            data: result.data,
            error: null
        }
    } catch (e: any) {
        return { data: null, error: { message: e.message } }
    }
}

function zodErrorToString(error: fieldErrors) {
    let { address, lat, lng, solarArrays } = error;
    return address ? address[0] : ""
        .concat(" ", lat ? lat[0] : "").trim()
        .concat(" ", lng ? lng[0] : "").trim()
        .concat(" ", solarArrays ? solarArrays[0] : "").trim();
}

// Store/update input data in database if user has an account
export async function setCalculatorData(input: CalculatorData): Promise<DataResult<string>> {
    try {
        // validate form data
        const validationResult = z.safeParse(calculatorSchema, input);
        if (!validationResult.success) {
            let zodError = z.flattenError(validationResult.error).fieldErrors;
            return { data: null, error: { message: "validation error", zodError } }
        }

        // get user id
        const session = await verifySession();
        if (!session?.isAuth) throw Error('User is not logged in');
        const userId = session.id;

        // get user data
        const result = await getUserSolarData(userId);
        if (result.error) throw Error(result.error.message);

        const currUserData = result.data;
        const currUserDataMap = new Map<number, UserSolarData>();
        currUserData.forEach((data) => currUserDataMap.set(parseInt(data.solarArrays.name), data));

        for (const sa of input.solarArrays) {
            let currSolarArrayData = {};
            let isUpdate = currUserDataMap.has(sa.id);

            if (isUpdate) {
                const data = currUserDataMap.get(sa.id);
                if (data) {
                    const { solarArrays, polygons, addresses } = data;
                    currSolarArrayData = {
                        id: sa.id,
                        addressId: addresses.id,
                        polygonsId: polygons.id,
                        dateCreated: solarArrays.dateCreated
                    }
                }
            }

            const solarArray: NewSolarArray = {
                ...currSolarArrayData,
                name: sa.id.toString(),
                capacity: sa.capacity,
                quantity: sa.quantity,
                userId: userId,
                lastModified: new Date(),
            }
            const polygon: NewPolygon = {
                coords: JSON.stringify(sa.shape),
                area: sa.area.toString(),
                azimuth: sa.azimuth.toString(),
                numberOfPoints: sa.shape.length
            }
            const address: NewAddress = {
                name: input.location.address,
                latitude: input.location.addressCoords.lat.toString(),
                longitude: input.location.addressCoords.lng.toString(),
                countryCode: input.location.countryCode,
            }

            const polygonValidation = z.safeParse(insertPolygonSchema, polygon);
            const solarArrayValidation = z.safeParse(insertSolarArraySchema, solarArray);
            const addressValidation = z.safeParse(insertAddressSchema, address);

            if (!polygonValidation.success ||
                !solarArrayValidation.success ||
                !addressValidation.success) {
                throw new Error("Failed to save data")
            }

            let result;
            // update or insert data
            if (isUpdate) {
                currUserDataMap.delete(sa.id);
                result = await updateUserSolarData({ solarArray, polygon });
            }
            else result = await insertUserSolarData({ solarArray, polygon, address });

            if (result.error) throw Error(result.error.message);
        }

        // delete old data
        for (const [key, _] of currUserDataMap) {
            const result = await deleteUserSolarData(key.toString(), userId);
            if (result.error) throw Error(result.error.message);
        }
        return { data: "Data saved successfully", error: null };
    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}





