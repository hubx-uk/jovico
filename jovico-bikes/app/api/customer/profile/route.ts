import { clearCustomerSession, requireCustomer, setCustomerSession } from '@/lib/customerAuth'
import { prisma } from '@/lib/prisma'
import { comparePasswords, hashPassword } from '@/lib/utils'
// app/api/customer/profile/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateSchema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).optional(),
})

export async function GET() {
    try {
        const session = await requireCustomer()
        const customer = await prisma.customer.findUnique({
            where: { id: session.id, deletedAt: null },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                createdAt: true,
            },
        })
        if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(customer)
    } catch {
        return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await requireCustomer()
        const data = updateSchema.parse(await req.json())

        if (data.newPassword) {
            if (!data.currentPassword) {
                return NextResponse.json({ error: 'Current password required' }, { status: 400 })
            }
            const customer = await prisma.customer.findUnique({ where: { id: session.id } })
            if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
            const valid = await comparePasswords(data.currentPassword, customer.password)
            if (!valid)
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 400 }
                )
        }

        const update: { name?: string; phone?: string; address?: string; password?: string } = {}
        if (data.name) update.name = data.name
        if (data.phone !== undefined) update.phone = data.phone
        if (data.address !== undefined) update.address = data.address
        if (data.newPassword) update.password = await hashPassword(data.newPassword)

        const updated = await prisma.customer.update({
            where: { id: session.id },
            data: update,
            select: { id: true, name: true, email: true, phone: true, address: true },
        })
        if (data.name)
            await setCustomerSession({ id: session.id, email: session.email, name: data.name })
        return NextResponse.json(updated)
    } catch (err) {
        if (err instanceof z.ZodError)
            return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
        if (err instanceof Error && err.message === 'Unauthenticated')
            return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function DELETE() {
    try {
        const session = await requireCustomer()
        await prisma.customer.update({ where: { id: session.id }, data: { deletedAt: new Date() } })
        await clearCustomerSession()
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
