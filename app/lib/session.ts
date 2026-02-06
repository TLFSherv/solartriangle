import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

type SessionPayload = {
    id: string,
    email: string
}

export const verifySession = async () => {
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
        return null
    }
    return { isAuth: true, ...payload }
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

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload as SessionPayload
    } catch (error) {
        console.log('Failed to verify session')
        return null
    }
}