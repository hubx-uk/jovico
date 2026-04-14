import bcrypt from 'bcryptjs'
// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET ?? 'jovico-bikes-dev-secret-key-change-in-production'
)
const COOKIE_NAME = 'jovico_admin_session'

export interface AdminSession {
    id: string
    email: string
    name: string
    role: string
}

export async function signToken(payload: AdminSession): Promise<string> {
    return new SignJWT(payload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload as unknown as AdminSession
    } catch {
        return null
    }
}

export async function getSession(): Promise<AdminSession | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return verifyToken(token)
}

export async function setSession(session: AdminSession): Promise<string> {
    const token = await signToken(session)
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    })
    return token
}

export async function clearSession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}

export async function loginAdmin(
    email: string,
    password: string
): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) return { success: false, error: 'Invalid email or password' }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) return { success: false, error: 'Invalid email or password' }

    const session: AdminSession = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
    }
    await setSession(session)
    return { success: true, session }
}

export async function requireAuth(): Promise<AdminSession> {
    const session = await getSession()
    if (!session) {
        throw new Error('Unauthorised')
    }
    return session
}

export function formatNaira(amount: number | string): string {
    const num = typeof amount === 'string' ? Number.parseFloat(amount) : amount
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(num)
}
