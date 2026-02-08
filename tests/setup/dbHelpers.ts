import { db } from '../../src/db/connection'
import { users, polygons, addresses, solarArrays, NewUser, NewSolarArray, NewPolygon, NewAddress } from '../../src/db/schema'
import { encrypt } from '../../app/lib/session'
import bcrypt from 'bcrypt'

export const createTestUser = async (userData?: Partial<NewUser>) => {
    const defaultData = {
        email: `testuser${Date.now()}@example.com`,
        password: 'password123',
        ...userData
    };
    const { email, password } = { ...defaultData };
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
    //const session = await encrypt({ id: user.id, email: user.email });

    // const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    // const cookieStore = await cookies();

    // cookieStore.set('session', session, {
    //     httpOnly: true,
    //     //secure: true,
    //     expires: expiresAt,
    //     sameSite: 'lax',
    //     path: '/'
    // });
    return { user, rawPassword: password };
}

export const createTestSolarArray = async (
    userId: string,
    solarArrayData: Partial<NewSolarArray>,
    addressData: Partial<NewAddress>,
    polygonData: Partial<NewPolygon>
) => {
    const defaultPolygons = {
        coords: `Test coords ${Date.now()}`
    };

    const defaultAddressData = {
        name: `Test Address ${Date.now()}`,
        latitude: 'latitude',
        longitude: 'longitude'
    };

    const defaultSolarArrayData = {
        name: `Test Solar Array ${Date.now()}`,
        capacity: 5000,
        quantity: 10,
        userId,
        polygonId: null,
        addressId: null,
        ...solarArrayData
    };

    let solarArray;
    await db.transaction((async (tx) => {
        const [polygonId] = await tx.insert(polygons)
            .values({ ...defaultPolygons, ...polygonData })
            .returning({ id: polygons.id });

        const [addressId] = await tx.insert(addresses)
            .values({ ...defaultAddressData, ...addressData })
            .returning({ id: addresses.id })
            .onConflictDoUpdate({
                target: addresses.name,
                set: { ...defaultAddressData, ...addressData }
            });

        [solarArray] = await tx.insert(solarArrays)
            .values({ ...defaultSolarArrayData, ...solarArrayData, polygonId: polygonId.id, addressId: addressId.id })
            .returning();
    }))
    return solarArray;
}

export const cleanupDatabase = async () => {
    await db.delete(solarArrays);
    await db.delete(users);
    await db.delete(polygons);
    await db.delete(addresses);
}



