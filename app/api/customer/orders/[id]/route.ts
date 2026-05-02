// app/api/customer/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireCustomer } from '@/lib/customerAuth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await requireCustomer()
        const { id } = await params
        const order = await prisma.order.findUnique({
            where: { id, customerId: session.id },
            include: {
                items: { include: { product: { select: { name: true, slug: true } } } },
            },
        })
        if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(order)
    } catch {
        return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }
}

// PATCH: customer can only cancel a PENDING order
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await requireCustomer()
        const { id } = await params
        const body: { action?: string; notes?: string } = await req.json()

        const order = await prisma.order.findUnique({
            where: { id, customerId: session.id },
        })
        if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        if (body.action === 'cancel') {
            if (order.status !== 'PENDING') {
                return NextResponse.json(
                    { error: 'Only pending orders can be cancelled.' },
                    { status: 400 }
                )
            }
            const updated = await prisma.order.update({
                where: { id },
                data: { status: 'CANCELLED' },
            })
            return NextResponse.json(updated)
        }

        if (body.notes !== undefined) {
            const updated = await prisma.order.update({
                where: { id },
                data: { notes: body.notes },
            })
            return NextResponse.json(updated)
        }

        return NextResponse.json({ error: 'No action specified' }, { status: 400 })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
