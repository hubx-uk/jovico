// app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { createSlug } from '@/lib/utils'

const serviceSchema = z.object({
    name: z.string().min(2),
    shortDesc: z.string().min(5),
    description: z.string().min(10),
    price: z.number().optional().nullable(),
    priceNote: z.string().optional(),
    duration: z.string().optional(),
    icon: z.string().optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    order: z.number().int().default(0),
})

export async function GET() {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(services)
}

export async function POST(req: NextRequest) {
    try {
        await requireAuth()
        const body = await req.json()
        const data = serviceSchema.parse(body)
        const service = await prisma.service.create({
            data: { ...data, slug: createSlug(data.name) },
        })
        return NextResponse.json(service, { status: 201 })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues }, { status: 400 })
        }
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
