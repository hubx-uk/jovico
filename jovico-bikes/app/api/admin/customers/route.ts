// app/api/admin/customers/route.ts
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        await requireAuth()

        const { searchParams } = new URL(req.url)
        const q = searchParams.get('q') ?? ''
        const filter = searchParams.get('filter') ?? 'all' // all | active | deleted
        const page = Math.max(1, Number(searchParams.get('page') ?? 1))
        const limit = 20
        const skip = (page - 1) * limit

        const where = {
            ...(q
                ? {
                      OR: [
                          { name: { contains: q } },
                          { email: { contains: q } },
                          { phone: { contains: q } },
                      ],
                  }
                : {}),
            ...(filter === 'active' ? { deletedAt: null } : {}),
            ...(filter === 'deleted' ? { deletedAt: { not: null } } : {}),
        }

        const [customers, total, stats] = await Promise.all([
            prisma.customer.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    deletedAt: true,
                    createdAt: true,
                    _count: { select: { orders: true } },
                },
            }),
            prisma.customer.count({ where }),
            prisma.customer.aggregate({
                _count: { id: true },
                where: { deletedAt: null },
            }),
        ])

        const deletedCount = await prisma.customer.count({ where: { deletedAt: { not: null } } })

        return NextResponse.json({
            customers,
            total,
            page,
            pages: Math.ceil(total / limit),
            stats: {
                active: stats._count.id,
                deleted: deletedCount,
                total: stats._count.id + deletedCount,
            },
        })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
