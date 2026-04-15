// app/api/products/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'
import { ProductCategory, ProductType } from '@/prisma/generated/prisma/enums'

const productSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    price: z.number().positive(),
    salePrice: z.number().positive().optional().nullable(),
    sku: z.string().min(1),
    stock: z.number().int().min(0),
    category: z.string(),
    type: z.string().default('BIKE'),
    brand: z.string().optional(),
    specs: z.record(z.string(), z.string()).optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
})

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const published = searchParams.get('published')

    const products = await prisma.product.findMany({
        where: {
            ...(category ? { category: category as unknown as ProductCategory } : {}),
            ...(published !== null ? { published: published === 'true' } : {}),
        },
        include: { images: { where: { isPrimary: true }, take: 1 } },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
    try {
        await requireAuth()
        const body = await req.json()
        const data = productSchema.parse(body)
        const slug = createSlug(data.name)

        const product = await prisma.product.create({
            data: {
                ...data,
                slug,
                type: data.type as ProductType,
                category: data.category as ProductCategory,
                price: data.price,
                salePrice: data.salePrice ?? null,
                specs: data.specs ?? undefined,
            },
        })
        return NextResponse.json(product, { status: 201 })
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
