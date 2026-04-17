import { unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
// app/api/products/[id]/images/[imageId]/route.ts
import { type NextRequest, NextResponse } from 'next/server'

// PATCH — set as primary
export async function PATCH(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string; imageId: string }> }
) {
    try {
        await requireAuth()
        const { id, imageId } = await params

        // Unset all primaries for this product, then set the new one
        await prisma.$transaction([
            prisma.productImage.updateMany({
                where: { productId: id },
                data: { isPrimary: false },
            }),
            prisma.productImage.update({
                where: { id: imageId },
                data: { isPrimary: true },
            }),
        ])

        const product = await prisma.product.findUnique({ where: { id }, select: { slug: true } })
        if (product) {
            revalidatePath('/shop')
            revalidatePath(`/shop/${product.slug}`)
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// DELETE — remove image
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string; imageId: string }> }
) {
    try {
        await requireAuth()
        const { id, imageId } = await params

        const image = await prisma.productImage.findUnique({ where: { id: imageId } })
        if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        await prisma.productImage.delete({ where: { id: imageId } })

        // If deleted image was primary and others exist, promote the first remaining
        if (image.isPrimary) {
            const next = await prisma.productImage.findFirst({
                where: { productId: id },
                orderBy: { id: 'asc' },
            })
            if (next) {
                await prisma.productImage.update({
                    where: { id: next.id },
                    data: { isPrimary: true },
                })
            }
        }

        // Delete file from disk if it's a local upload
        if (image.url.startsWith('/uploads/')) {
            try {
                await unlink(join(process.cwd(), 'public', image.url))
            } catch {
                // file may not exist — ok
            }
        }

        const product = await prisma.product.findUnique({ where: { id }, select: { slug: true } })
        if (product) {
            revalidatePath('/shop')
            revalidatePath(`/shop/${product.slug}`)
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
