// app/api/subscribers/export/route.ts
import { NextResponse } from 'next/server'

import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        await requireAuth()
        const subscribers = await prisma.subscriber.findMany({
            where: { active: true },
            orderBy: { createdAt: 'desc' },
        })

        const rows = [
            ['Email', 'Name', 'Subscribed Date'].join(','),
            ...subscribers.map((s) => [s.email, s.name ?? '', s.createdAt.toISOString()].join(',')),
        ].join('\n')

        return new NextResponse(rows, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="subscribers-${Date.now()}.csv"`,
            },
        })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
