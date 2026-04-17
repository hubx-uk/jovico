import { requireCustomer } from '@/lib/customerAuth'
import { prisma } from '@/lib/prisma'
// app/api/customer/orders/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const session = await requireCustomer()
        const orders = await prisma.order.findMany({
            where: { customerId: session.id },
            include: {
                items: {
                    include: { product: { select: { name: true, slug: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(orders)
    } catch {
        return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }
}
