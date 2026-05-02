// app/admin/shop/[id]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { prisma } from '@/lib/prisma'
import type { ProductEditorData } from '@/types'
import { ProductEditor } from '@/components/admin/ProductEditor'
import { ProductImageManager } from '@/components/admin/ProductImageManager'

export const metadata: Metadata = { title: 'Edit Product' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = (await prisma.product.findUnique({
        where: { id },
        include: { images: { orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }] } },
    })) as ProductEditorData | null
    if (!product) notFound()

    return (
        <div className='max-w-4xl mx-auto'>
            <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900 mb-6 sm:mb-8'>
                Edit Product
            </h1>
            <div className='space-y-6'>
                <ProductEditor product={product} mode='edit' />
                <ProductImageManager
                    productId={product.id}
                    initialImages={product.images.map((img) => ({
                        id: img.id,
                        url: img.url,
                        alt: img.alt,
                        isPrimary: img.isPrimary,
                    }))}
                />
            </div>
        </div>
    )
}
