import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
// app/api/products/[id]/images/route.ts
import { type NextRequest, NextResponse } from 'next/server'

// GET — list all images for a product
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const images = await prisma.productImage.findMany({
        where: { productId: id },
        orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }],
    })
    return NextResponse.json(images)
}

// POST — upload a new image (multipart/form-data OR JSON with URL)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAuth()
        const { id } = await params

        // Check product exists
        const product = await prisma.product.findUnique({
            where: { id },
            include: { images: true },
        })
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

        const contentType = req.headers.get('content-type') ?? ''

        let url: string
        let alt: string | undefined

        if (contentType.includes('multipart/form-data')) {
            // File upload — save to /public/uploads/products/
            const formData = await req.formData()
            const file = formData.get('file') as File | null
            alt = formData.get('alt') as string | undefined

            if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const uploadDir = join(process.cwd(), 'public', 'uploads', 'products')
            await mkdir(uploadDir, { recursive: true })

            const ext = file.name.split('.').pop() ?? 'jpg'
            const filename = `${id}-${Date.now()}.${ext}`
            await writeFile(join(uploadDir, filename), buffer)
            url = `/uploads/products/${filename}`
        } else {
            // JSON with external URL
            const body = await req.json()
            url = body.url
            alt = body.alt
            if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
        }

        // First image becomes primary automatically
        const isPrimary = product.images.length === 0

        const image = await prisma.productImage.create({
            data: { productId: id, url, alt: alt ?? undefined, isPrimary },
        })

        // Revalidate shop pages
        revalidatePath('/shop')
        revalidatePath(`/shop/${product.slug}`)

        return NextResponse.json(image, { status: 201 })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
