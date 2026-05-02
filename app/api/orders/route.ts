// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { getCustomerSession } from '@/lib/customerAuth'

const orderSchema = z.object({
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    customerPhone: z.string().min(8),
    shippingAddress: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
    }),
    items: z.array(
        z.object({
            productId: z.string(),
            name: z.string(),
            price: z.number(),
            quantity: z.number().int().positive(),
            image: z.string().optional(),
        })
    ),
    notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
    try {
        const body: unknown = await req.json()
        const data = orderSchema.parse(body)

        // Resolve the logged-in customer (if any) from the session cookie
        let customerId: string | undefined
        try {
            const session = await getCustomerSession()
            if (session) customerId = session.id
        } catch {
            // Guest checkout — no session, that's fine
        }

        const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const shipping = subtotal > 100000 ? 0 : 5000
        const total = subtotal + shipping

        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                shippingAddress: data.shippingAddress,
                subtotal,
                shipping,
                total,
                notes: data.notes,
                ...(customerId ? { customerId } : {}),
                items: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                },
            },
            include: { items: true },
        })

        // Decrement stock for each ordered product
        for (const item of data.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            })
        }

        return NextResponse.json(order, { status: 201 })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues }, { status: 400 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function GET() {
    const orders = await prisma.order.findMany({
        include: {
            items: { include: { product: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
}
