import 'server-only'
import db from "../../src/db/connection"
import { eq, and } from 'drizzle-orm'
import {
    users, solarArrays, polygons, addresses, countries,
    type NewUser, type Countries, type User
} from "../../src/db/schema"
import {
    type UserData,
    type UserSolarData,
    type UserSolarDataUpdate,
    type UserSolarDataInsert,
} from './../types/dto'
import bcrypt from 'bcrypt'
import z from 'zod'

type DBResult<T> =
    | { data: T; error: null }
    | { data: null; error: { message: string; code?: string } };

export async function getUserByEmail(email: string): Promise<DBResult<User>> {
    try {
        const user = await db.select().from(users).where(eq(users.email, email));
        return { data: user[0], error: null };
    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

// most errors in the login flow would be considered server errors so respond with status 500
export async function createUser(email: string, password: string): Promise<DBResult<UserData>> {
    try {
        // hash password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const userData: NewUser = {
            email,
            password: hashedPassword,
            dateCreated: new Date()
        };
        // insert the user into the database
        const result = await db
            .insert(users)
            .values(userData)
            .returning({ id: users.id, email: users.email });

        return { data: result[0], error: null };
    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

export async function getUserSolarData(userId: string): Promise<DBResult<UserSolarData[]>> {
    try {
        const result = await db.select()
            .from(solarArrays)
            .innerJoin(polygons, eq(solarArrays.polygonId, polygons.id))
            .innerJoin(addresses, eq(solarArrays.addressId, addresses.id))
            .innerJoin(countries, eq(addresses.countryCode, countries.code))
            .where(eq(solarArrays.userId, userId));

        return { data: result, error: null };
    } catch (e) {
        return { data: null, error: { message: "error selecting data" } };
    }
}

export async function updateUserSolarData(input: UserSolarDataUpdate):
    Promise<DBResult<string>> {
    try {
        const result = await db.transaction(async (tx) => {
            const [polygonId] = await tx.update(solarArrays)
                .set({ ...input.solarArray })
                .where(and(eq(solarArrays.id, input.solarArray.id as string),
                    eq(solarArrays.userId, input.solarArray.userId as string)))
                .returning({ polygonId: solarArrays.polygonId });

            await tx.update(polygons)
                .set(input.polygon)
                .where(eq(polygons.id, polygonId.polygonId as string));
            return polygonId
        });
        return { data: result.polygonId as string, error: null };
    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

export async function insertUserSolarData
    (input: UserSolarDataInsert): Promise<DBResult<string>> {
    try {
        const result = await db.transaction((async (tx) => {
            const [polygonId] = await tx.insert(polygons)
                .values(input.polygon)
                .returning({ id: polygons.id });

            const [addressId] = await tx.insert(addresses)
                .values(input.address)
                .returning({ id: addresses.id })
                .onConflictDoUpdate({
                    target: addresses.name,
                    set: { ...input.address }
                });
            const [solarArrayId] = await tx.insert(solarArrays)
                .values({ ...input.solarArray, polygonId: polygonId.id, addressId: addressId.id })
                .returning({ id: solarArrays.id });
            return solarArrayId;
        }))
        return { data: result.id, error: null };
    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

export async function deleteUserSolarData(solarArrayId: string, userId: string): Promise<DBResult<string[]>> {
    try {
        const result = await db.delete(solarArrays)
            .where(and(eq(solarArrays.id, solarArrayId),
                eq(solarArrays.userId, userId)))
            .returning({ id: solarArrays.id });
        const resultArray = result.map(({ id }) => id);
        return { data: resultArray, error: null };
    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

export async function getCountries(): Promise<DBResult<Countries[]>> {
    try {
        const result = await db
            .select()
            .from(countries);
        return { data: result, error: null };

    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

