import 'server-only'
import db from "../../src/db/connection"
import { eq, and } from 'drizzle-orm'
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
    try {
        const solarArray = await db.select()
            .from(solarArrays)
            .innerJoin(polygons, eq(solarArrays.polygonId, polygons.id))
            .innerJoin(addresses, eq(solarArrays.addressId, addresses.id))
            .where(eq(solarArrays.userId, userId));
        return { success: true, data: solarArray };
    } catch (e) {
        return { sucess: false, data: null }
    }
}

export async function dbUpdate(userId: string, solarArray: NewSolarArray, polygon: NewPolygon) {
    try {
        return await db.transaction(async (tx) => {
            const [polygonId] = await tx.update(solarArrays)
                .set({ ...solarArray })
                .where(and(eq(solarArrays.id, solarArray.id as string), eq(solarArrays.userId, userId)))
                .returning({ polygonId: solarArrays.polygonId });

            console.log(solarArray.id, userId);
            console.log(polygonId);

            await tx.update(polygons)
                .set(polygon)
                .where(eq(polygons.id, polygonId.polygonId as string))
                .returning({ id: polygons.id });

            return { success: true, message: "data updated successfully", error: "" };
        });
    } catch (e: any) {
        return { success: false, message: "data failed to update", error: e.message };
    }
}

export async function dbInsert(solarArray: NewSolarArray, polygon: NewPolygon, address: NewAddress) {
    try {
        await db.transaction((async (tx) => {
            const [polygonId] = await tx.insert(polygons)
                .values(polygon)
                .returning({ id: polygons.id });

            const [addressId] = await tx.insert(addresses)
                .values(address)
                .returning({ id: addresses.id })
                .onConflictDoUpdate({
                    target: addresses.name,
                    set: { ...address }
                });

            await tx.insert(solarArrays)
                .values({ ...solarArray, polygonId: polygonId.id, addressId: addressId.id })
                .returning({ id: solarArrays.id });
        }))
        return { success: true, message: "data saved successfully", error: "" };
    } catch (e: any) {
        return { success: false, message: "data failed to save", error: e.message };
    }
}

export async function dbDelete(id: string, userId: string) {
    try {
        const result = await db.delete(solarArrays)
            .where(and(eq(solarArrays.id, id), eq(solarArrays.userId, userId)))
            .returning({ id: solarArrays.id });
        return { success: true, data: "data deleted successfully", error: "" };
    } catch (e: any) {
        return { success: false, data: null, error: e.message }
    }
}

