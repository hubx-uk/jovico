// app/(main)/shop/[slug]/page.tsx
import { Zap, Shield, Clock, MessageCircle, ChevronRight, Star } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

import { prisma } from '@/lib/prisma'
import { formatNaira } from '@/lib/utils'
import { getSettings, waNumber } from '@/lib/getSettings'
import { EnquireButton } from '@/components/shop/EnquireButton'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { ProductImageSlider } from '@/components/shop/ProductImageSlider'

export async function generateStaticParams() {
    const products = await prisma.product.findMany({ select: { slug: true } })
    return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const product = await prisma.product.findUnique({ where: { slug } })
    if (!product) return {}
    return { title: product.name, description: product.description }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await prisma.product.findUnique({
        where: { slug, published: true },
        include: {
            images: { orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }] },
        },
    })

    if (!product) notFound()

    const [related, settings] = await Promise.all([
        prisma.product.findMany({
            where: { category: product.category, NOT: { id: product.id }, published: true },
            include: { images: { where: { isPrimary: true }, take: 1 } },
            take: 3,
        }),
        getSettings(['whatsapp', 'site_name']),
    ])
    const wa = waNumber(settings)

    const specs = product.specs as Record<string, string> | null

    return (
        <>
            {/* Breadcrumb */}
            <div className='pt-24 sm:pt-28 pb-3 bg-white border-b border-slate-100'>
                <div className='jv-container'>
                    <nav className='flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 overflow-x-auto whitespace-nowrap pb-1'>
                        <Link href='/' className='hover:text-slate-900 transition-colors shrink-0'>
                            Home
                        </Link>
                        <ChevronRight className='w-3 h-3 shrink-0' />
                        <Link
                            href='/shop'
                            className='hover:text-slate-900 transition-colors shrink-0'
                        >
                            Shop
                        </Link>
                        <ChevronRight className='w-3 h-3 shrink-0' />
                        <span className='text-slate-900 font-medium truncate'>{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Product Detail */}
            <section className='jv-section bg-white'>
                <div className='jv-container'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14'>
                        {/* Image Slider */}
                        <ProductImageSlider
                            images={product.images.map((img) => ({
                                id: img.id,
                                url: img.url,
                                alt: img.alt,
                                isPrimary: img.isPrimary,
                            }))}
                            productName={product.name}
                        />

                        {/* Info */}
                        <div className='flex flex-col'>
                            {/* Badges */}
                            <div className='flex flex-wrap items-center gap-2 mb-3'>
                                <span className='jv-badge bg-slate-100 text-slate-600 text-xs uppercase tracking-wider'>
                                    {product.category.replace(/_/g, ' ')}
                                </span>
                                {product.featured && (
                                    <span className='jv-badge bg-green-50 text-green-700 text-xs'>
                                        ⚡ Popular Choice
                                    </span>
                                )}
                            </div>

                            <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight'>
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className='flex items-center gap-2 mb-4 sm:mb-5'>
                                <div className='flex'>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className='w-4 h-4 text-yellow-400 fill-yellow-400'
                                        />
                                    ))}
                                </div>
                                <span className='text-sm text-slate-500'>(24 reviews)</span>
                            </div>

                            {/* Price */}
                            <div className='flex items-end gap-3 mb-2'>
                                <span className='text-3xl sm:text-4xl font-extrabold text-slate-900'>
                                    {formatNaira(Number(product.price))}
                                </span>
                                {product.salePrice && (
                                    <span className='text-base sm:text-lg text-slate-400 line-through mb-1'>
                                        {formatNaira(Number(product.salePrice))}
                                    </span>
                                )}
                            </div>

                            {/* Stock */}
                            <div className='flex items-center gap-2 mb-5'>
                                {product.stock > 0 ? (
                                    <>
                                        <div className='w-2 h-2 rounded-full bg-green-500' />
                                        <span className='text-sm text-green-600 font-medium'>
                                            {product.stock < 5
                                                ? `Only ${product.stock} left in stock`
                                                : 'In Stock'}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className='w-2 h-2 rounded-full bg-red-500' />
                                        <span className='text-sm text-red-500 font-medium'>
                                            Out of Stock
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className='text-slate-600 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base'>
                                {product.description}
                            </p>

                            {/* Actions */}
                            <div className='flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8'>
                                <AddToCartButton
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: Number(product.price),
                                        slug: product.slug,
                                    }}
                                />
                                <EnquireButton
                                    productName={product.name}
                                    whatsapp={settings.whatsapp}
                                />
                            </div>

                            {/* Trust signals */}
                            <div className='grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8'>
                                {[
                                    { icon: Shield, label: '1 Year Warranty' },
                                    { icon: Zap, label: 'Premium Parts' },
                                    { icon: Clock, label: 'Fast Delivery' },
                                ].map((t) => (
                                    <div
                                        key={t.label}
                                        className='flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-2xl bg-slate-50 text-center'
                                    >
                                        <t.icon className='w-4 h-4 sm:w-5 sm:h-5 text-slate-700' />
                                        <span className='text-[10px] sm:text-xs font-medium text-slate-700 leading-tight'>
                                            {t.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* WhatsApp CTA */}
                            <div className='flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-100'>
                                <MessageCircle className='w-5 h-5 text-green-600 shrink-0' />
                                <div className='flex-1 text-xs sm:text-sm text-green-800'>
                                    Need help? Chat with our eBike experts on WhatsApp
                                </div>
                                <a
                                    href={`https://wa.me/${wa}?text=Hi! I'm interested in the ${product.name}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-xs sm:text-sm font-bold text-green-700 hover:text-green-900 whitespace-nowrap shrink-0'
                                >
                                    Chat →
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Specs Table */}
                    {specs && Object.keys(specs).length > 0 && (
                        <div className='mt-12 sm:mt-16'>
                            <h2 className='text-xl sm:text-2xl font-extrabold text-slate-900 mb-5 sm:mb-6'>
                                Technical Specifications
                            </h2>
                            <div className='rounded-2xl sm:rounded-3xl border border-slate-100 overflow-hidden'>
                                <table className='w-full text-sm'>
                                    <tbody>
                                        {Object.entries(specs).map(([key, value], i) => (
                                            <tr
                                                key={key}
                                                className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                                            >
                                                <td className='px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-700 capitalize w-32 sm:w-40 text-xs sm:text-sm'>
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </td>
                                                <td className='px-4 sm:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm'>
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Related Products */}
            {related.length > 0 && (
                <section className='jv-section bg-slate-50'>
                    <div className='jv-container'>
                        <h2 className='text-xl sm:text-2xl font-extrabold text-slate-900 mb-6 sm:mb-8'>
                            You Might Also Like
                        </h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                            {related.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/shop/${p.slug}`}
                                    className='group jv-card bg-white overflow-hidden'
                                >
                                    <div className='aspect-[4/3] bg-slate-50 rounded-t-3xl overflow-hidden'>
                                        {p.images[0]?.url &&
                                        (p.images[0].url.startsWith('http') ||
                                            p.images[0].url.startsWith('/')) ? (
                                            <img
                                                src={p.images[0].url}
                                                alt={p.images[0].alt ?? p.name}
                                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                                            />
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300'>
                                                🚴
                                            </div>
                                        )}
                                    </div>
                                    <div className='p-4 sm:p-5'>
                                        <p className='text-xs text-slate-400 mb-1'>
                                            {p.category.replace(/_/g, ' ')}
                                        </p>
                                        <h3 className='font-bold text-slate-900 group-hover:text-green-600 transition-colors mb-2 text-sm sm:text-base'>
                                            {p.name}
                                        </h3>
                                        <span className='font-extrabold text-slate-900 text-sm sm:text-base'>
                                            {formatNaira(Number(p.price))}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
