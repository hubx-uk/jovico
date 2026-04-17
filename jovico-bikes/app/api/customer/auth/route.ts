import {
    clearCustomerSession,
    getCustomerSession,
    loginCustomer,
    registerCustomer,
} from '@/lib/customerAuth'
// app/api/customer/auth/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phone: z.string().optional(),
})

export async function POST(req: NextRequest) {
    try {
        const body: Record<string, unknown> = await req.json()
        const { action, ...rest } = body

        if (action === 'register') {
            const data = registerSchema.parse(rest)
            const result = await registerCustomer(data.name, data.email, data.password, data.phone)
            if (!result.success) {
                return NextResponse.json({ error: result.error }, { status: 409 })
            }
            return NextResponse.json({ success: true, user: result.session }, { status: 201 })
        }

        const data = loginSchema.parse(rest)
        const result = await loginCustomer(data.email, data.password)
        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 401 })
        }
        return NextResponse.json({ success: true, user: result.session })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function DELETE() {
    await clearCustomerSession()
    return NextResponse.json({ success: true })
}

export async function GET() {
    const session = await getCustomerSession()
    if (!session) return NextResponse.json({ user: null }, { status: 401 })
    return NextResponse.json({ user: session })
}
