// lib/customerAuth.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

import type { CustomerSession } from '@/types'
import { prisma } from './prisma'
import { comparePasswords, hashPassword } from './utils'

const SECRET = new TextEncoder().encode(
    process.env.CUSTOMER_JWT_SECRET ?? process.env.JWT_SECRET ?? 'jovico-customer-secret-change-me'
)
const COOKIE = 'jovico_customer_session'

export async function signCustomerToken(payload: CustomerSession): Promise<string> {
    return new SignJWT(payload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(SECRET)
}

export async function verifyCustomerToken(token: string): Promise<CustomerSession | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET)
        return payload as unknown as CustomerSession
    } catch {
        return null
    }
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
    const jar = await cookies()
    const token = jar.get(COOKIE)?.value
    if (!token) return null
    return verifyCustomerToken(token)
}

export async function setCustomerSession(session: CustomerSession): Promise<void> {
    const token = await signCustomerToken(session)
    const jar = await cookies()
    jar.set(COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
    })
}

export async function clearCustomerSession(): Promise<void> {
    const jar = await cookies()
    jar.delete(COOKIE)
}

export async function requireCustomer(): Promise<CustomerSession> {
    const session = await getCustomerSession()
    if (!session) throw new Error('Unauthenticated')
    return session
}

export async function registerCustomer(
    name: string,
    email: string,
    password: string,
    phone?: string
): Promise<{ success: boolean; error?: string; session?: CustomerSession }> {
    const exists = await prisma.customer.findUnique({ where: { email } })
    if (exists) return { success: false, error: 'An account with this email already exists.' }

    const hashed = await hashPassword(password)
    const customer = await prisma.customer.create({
        data: { name, email, password: hashed, phone },
    })

    const session: CustomerSession = { id: customer.id, email: customer.email, name: customer.name }
    await setCustomerSession(session)
    return { success: true, session }
}

export async function loginCustomer(
    email: string,
    password: string
): Promise<{ success: boolean; error?: string; session?: CustomerSession }> {
    const customer = await prisma.customer.findUnique({ where: { email, deletedAt: null } })
    if (!customer) return { success: false, error: 'Invalid email or password.' }

    const valid = await comparePasswords(password, customer.password)
    if (!valid) return { success: false, error: 'Invalid email or password.' }

    const session: CustomerSession = { id: customer.id, email: customer.email, name: customer.name }
    await setCustomerSession(session)
    return { success: true, session }
}
