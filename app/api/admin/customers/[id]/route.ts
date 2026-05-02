// app/api/admin/customers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

const patchSchema = z.object({
    // Profile edits
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    // Account actions
    action: z.enum(['restore', 'hard-delete']).optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAuth()
        const { id } = await params

        const customer = await prisma.customer.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                deletedAt: true,
                createdAt: true,
                updatedAt: true,
                orders: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        items: {
                            include: { product: { select: { name: true, slug: true } } },
                        },
                    },
                },
            },
        })

        if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(customer)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAuth()
        const { id } = await params
        const body = patchSchema.parse(await req.json())

        if (body.action === 'restore') {
            const customer = await prisma.customer.update({
                where: { id },
                data: { deletedAt: null },
                select: { id: true, name: true, email: true, deletedAt: true },
            })
            return NextResponse.json(customer)
        }

        if (body.action === 'hard-delete') {
            // Hard delete — permanently removes the customer record.
            // Orders are kept (nullify customerId FK) for accounting purposes.
            await prisma.order.updateMany({
                where: { customerId: id },
                data: { customerId: null },
            })
            await prisma.customer.delete({ where: { id } })
            return NextResponse.json({ success: true, hardDeleted: true })
        }

        // Profile update
        const updateData: {
            name?: string
            phone?: string
            address?: string
        } = {}
        if (body.name) updateData.name = body.name
        if (body.phone !== undefined) updateData.phone = body.phone
        if (body.address !== undefined) updateData.address = body.address

        const customer = await prisma.customer.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, phone: true, address: true },
        })
        return NextResponse.json(customer)
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
        }
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// Soft-delete (sets deletedAt = now). Use PATCH action:"hard-delete" for permanent removal.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAuth()
        const { id } = await params
        const customer = await prisma.customer.update({
            where: { id },
            data: { deletedAt: new Date() },
            select: { id: true, name: true, deletedAt: true },
        })
        return NextResponse.json(customer)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
