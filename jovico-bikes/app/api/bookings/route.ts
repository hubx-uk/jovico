// app/api/bookings/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const bookingSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    serviceId: z.string(),
    date: z.string(),
    notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const data = bookingSchema.parse(body)
        const booking = await prisma.booking.create({
            data: {
                ...data,
                date: new Date(data.date),
            },
        })
        return NextResponse.json(booking, { status: 201 })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function GET() {
    const bookings = await prisma.booking.findMany({
        include: { service: { select: { name: true } } },
        orderBy: { date: 'asc' },
    })
    return NextResponse.json(bookings)
}
