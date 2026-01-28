import 'server-only'
import db from "../../src/db/connection"
import { eq } from 'drizzle-orm'
import { users, NewUser, User } from "../../src/db/schema"
import bcrypt from 'bcrypt'
import { CalculatorData, type FormInputs } from "@/app/types/types";

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

export async function getSolarArrays(userId: string): Promise<FormInputs> {

    return {
        address: '',
        location: null,
        polygons: [],
        solarArrays: []
    };
}
export async function createSolarArrays(userId: string, data: CalculatorData) {

    try {
        // 1. check if user already has solar arrays
        const solarArrays = await getSolarArrays(userId);
        // 2. if they do call update function
        if (solarArrays) updateSolarArrays(userId, data);
        //3. if they don't then create
        else {

        }
    } catch (e: any) {
        return { success: false, details: "Error creating solar arrays" };
    }

}

async function updateSolarArrays(userId: string, data: CalculatorData) {


}

