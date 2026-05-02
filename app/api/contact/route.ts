// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(1),
    message: z.string().min(10),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const data = schema.parse(body)
        await prisma.contactMessage.create({ data })
        return NextResponse.json({ success: true })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    // Admin only — retrieve messages
    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
    })
    return NextResponse.json(messages)
}
