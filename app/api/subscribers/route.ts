// app/api/subscribers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const schema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const data = schema.parse(body)
        await prisma.subscriber.upsert({
            where: { email: data.email },
            update: { active: true },
            create: data,
        })
        return NextResponse.json({ success: true })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
