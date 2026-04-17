// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { createSlug } from '@/lib/utils'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await prisma.product.findUnique({
        where: { id },
        include: { images: true },
    })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAuth()
        const { id } = await params
        const body = await req.json()
        const { name, ...rest } = body

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(name ? { name, slug: createSlug(name) } : {}),
                ...rest,
            },
        })

        revalidatePath('/shop')
        revalidatePath(`/shop/${product.slug}`)

        return NextResponse.json(product)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAuth()
        const { id } = await params
        const product = await prisma.product.findUnique({ where: { id } })
        await prisma.product.delete({ where: { id } })
        if (product) {
            revalidatePath('/shop')
            revalidatePath(`/shop/${product.slug}`)
            revalidatePath('/accessories')
        }
        return NextResponse.json({ success: true })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
