import 'server-only'
import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

type SessionPayload = {
    id: string,
    email: string
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