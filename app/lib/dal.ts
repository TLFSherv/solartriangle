import 'server-only'
import { cookies } from 'next/headers'
import db from "../../src/db/connection"
import { eq } from 'drizzle-orm'
import { users, NewUser, User } from "../../src/db/schema"
import bcrypt from 'bcrypt'
import { nanoid } from "nanoid"
import { encrypt, decrypt } from './session'

export async function getUserByEmail(email: string): Promise<User> {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user[0];
}

export async function createSession(userId: string, email: string) {
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const session = await encrypt({ id: userId, email });
    const cookieStore = await cookies();

    cookieStore.set('session', session, {
        httpOnly: true,
        //secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'
    });
}
// extend session duration if user reopens application
export async function updateSession() {
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
        return null
    }

    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        //secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/'
    })
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

export async function createUser(email: string, password: string) {
    // hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const userFields: NewUser = {
        id: nanoid(),
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