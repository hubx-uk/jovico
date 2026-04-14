// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
    const settings = await prisma.siteSetting.findMany()
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))
    return NextResponse.json(map)
}

export async function POST(req: NextRequest) {
    try {
        await requireAuth()
        const body = await req.json()

        for (const [key, value] of Object.entries(body)) {
            await prisma.siteSetting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            })
        }
        return NextResponse.json({ success: true })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
