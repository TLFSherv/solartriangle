import { db } from '../../src/db/connection'
import { users, polygons, addresses, solarArrays, NewUser, NewSolarArray } from '../../src/db/schema'
import { encrypt, decrypt } from '@/app/lib/session'
import bcrypt from 'bcrypt'

export const createTestUser = async (userData: Partial<NewUser>) => {
    const defaultData = {
        email: `testuser${Date.now()}@example.com`,
        password: 'password123',
        ...userData
    };
    const { email, password } = { ...defaultData, ...userData };
    // hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
        .insert(users)
        .values({
            ...defaultData,
            email,
            password: hashedPassword
        }).returning();

    // create session
    const session = await encrypt({ id: user.id, email: user.email });
    // const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    // const cookieStore = await cookies();

    // cookieStore.set('session', session, {
    //     httpOnly: true,
    //     //secure: true,
    //     expires: expiresAt,
    //     sameSite: 'lax',
    //     path: '/'
    // });
    return { user, session, rawPassword: password };
}

export const createSolarArray = async (
    userId: string,
    solarArrayData: Partial<NewSolarArray>) => {
    const defaultData = {
        name: `Test Solar Array ${Date.now()}`,
        capacity: 5000,
        quantity: 10,
        userId,
        polygonId: null,
        addressId: null,
        ...solarArrayData
    };
    const [solarArray] = await db
        .insert(solarArrays)
        .values({
            ...defaultData,
            ...solarArrayData
        }).returning();
    return solarArray;
}

const clearTables = async () => {
    await db.delete(solarArrays);
    await db.delete(users);
    await db.delete(polygons);
    await db.delete(addresses);
}



