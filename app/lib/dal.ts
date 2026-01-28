import 'server-only'
import db from "../../src/db/connection"
import { eq } from 'drizzle-orm'
import {
    users, solarArrays, polygons, addresses,
    type NewUser, type User, type NewSolarArray, type NewPolygon, type NewAddress,
} from "../../src/db/schema"
import bcrypt from 'bcrypt'

export async function getUserByEmail(email: string): Promise<User> {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user[0];
}

// most errors in the login flow would be considered server errors so respond with status 500
export async function createUser(email: string, password: string) {
    // hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const userFields: NewUser = {
        email,
        password: hashedPassword,
        dateCreated: new Date()
    };
    // insert the user into the database
    const data = await db
        .insert(users)
        .values(userFields)
        .returning({ id: users.id, email: users.email });

    return data[0];
}

export async function getSolarArrays(userId: string) {
    const solarArray = await db.select()
        .from(solarArrays)
        .innerJoin(polygons, eq(solarArrays.polygonId, polygons.id))
        .innerJoin(addresses, eq(solarArrays.addressId, addresses.id))
        .where(eq(solarArrays.userId, userId));

    return solarArray;
}

export async function insertSolarArray(data: NewSolarArray) {
    const result = await db.insert(solarArrays)
        .values(data)
        .returning({ id: solarArrays.id });
    return result[0].id;
}

export async function insertAddress(data: NewAddress) {
    const result = await db.insert(addresses)
        .values(data)
        .returning({ id: addresses.id })
        .onConflictDoNothing();
    return result[0].id;
}

export async function insertPolygon(data: NewPolygon) {
    const result = await db.insert(polygons)
        .values(data)
        .returning({ id: polygons.id });
    return result[0].id;
}

export async function updateSolarArray(data: NewSolarArray) {
    const result = await db.update(solarArrays)
        .set(data)
        .where(eq(solarArrays.id, data.id as string))
        .returning({ id: solarArrays.id });
    return result[0].id;
}

export async function updatePolygon(data: NewPolygon) {
    const result = await db.update(polygons)
        .set(data)
        .where(eq(polygons.id, data.id as string))
        .returning({ id: polygons.id });
    return result[0].id;
}

export async function deleteSolarArray(id: string) {
    const result = await db.delete(solarArrays)
        .where(eq(solarArrays.id, id))
        .returning({ id: solarArrays.id });
    return result[0].id;
}

