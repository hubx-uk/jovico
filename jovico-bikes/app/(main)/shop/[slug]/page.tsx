// app/main/shop/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
    ArrowLeft,
    CheckCircle2,
    Zap,
    Shield,
    Clock,
    MessageCircle,
    Phone,
    ChevronRight,
    Star,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatNaira } from '@/lib/utils'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { EnquireButton } from '@/components/shop/EnquireButton'

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
    return {
        title: product.name,
        description: product.description,
    }
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const product = await prisma.product.findUnique({
        where: { slug, published: true },
        include: { images: true },
    })

    if (!product) notFound()

    const related = await prisma.product.findMany({
        where: {
            category: product.category,
            NOT: { id: product.id },
            published: true,
        },
        include: { images: { where: { isPrimary: true }, take: 1 } },
        take: 3,
    })

    const specs = product.specs as Record<string, string> | null

    return (
        <>
            {/* Breadcrumb */}
            <div className='pt-24 pb-4 bg-white border-b border-slate-100'>
                <div className='jv-container'>
                    <nav className='flex items-center gap-2 text-sm text-slate-500'>
                        <Link href='/' className='hover:text-slate-900 transition-colors'>
                            Home
                        </Link>
                        <ChevronRight className='w-3.5 h-3.5' />
                        <Link href='/shop' className='hover:text-slate-900 transition-colors'>
                            Shop
                        </Link>
                        <ChevronRight className='w-3.5 h-3.5' />
                        <span className='text-slate-900 font-medium truncate max-w-48'>
                            {product.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Product Detail */}
            <section className='jv-section bg-white'>
                <div className='jv-container'>
                    <div className='grid lg:grid-cols-2 gap-12 xl:gap-16'>
                        {/* Left: Images */}
                        <div>
                            {/* Main image */}
                            <div className='aspect-square rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10rem] mb-4 overflow-hidden'>
                                🚴
                            </div>
                            {/* Thumbnails */}
                            {product.images.length > 1 && (
                                <div className='grid grid-cols-4 gap-3'>
                                    {product.images.map((img, i) => (
                                        <div
                                            key={img.id}
                                            className='aspect-square rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-3xl cursor-pointer hover:border-slate-900 transition-colors'
                                        >
                                            🚴
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className='flex flex-col'>
                            {/* Category + badges */}
                            <div className='flex items-center gap-2 mb-3'>
                                <span className='jv-badge bg-slate-100 text-slate-600 text-xs uppercase tracking-wider'>
                                    {product.category.replace(/_/g, ' ')}
                                </span>
                                {product.featured && (
                                    <span className='jv-badge bg-green-50 text-green-700 text-xs'>
                                        ⚡ Popular Choice
                                    </span>
                                )}
                            </div>

                            <h1 className='text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight'>
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className='flex items-center gap-2 mb-5'>
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
                                <span className='text-4xl font-extrabold text-slate-900'>
                                    {formatNaira(Number(product.price))}
                                </span>
                                {product.salePrice && (
                                    <span className='text-lg text-slate-400 line-through mb-1'>
                                        {formatNaira(Number(product.salePrice))}
                                    </span>
                                )}
                            </div>

                            {/* Stock */}
                            <div className='flex items-center gap-2 mb-6'>
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

                            <p className='text-slate-600 leading-relaxed mb-8'>
                                {product.description}
                            </p>

                            {/* Actions */}
                            <div className='flex flex-col sm:flex-row gap-3 mb-8'>
                                <AddToCartButton
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: Number(product.price),
                                        slug: product.slug,
                                    }}
                                />
                                <EnquireButton productName={product.name} />
                            </div>

                            {/* Trust signals */}
                            <div className='grid grid-cols-3 gap-3 mb-8'>
                                {[
                                    { icon: Shield, label: '1 Year Warranty' },
                                    { icon: Zap, label: 'Premium Parts' },
                                    { icon: Clock, label: 'Fast Delivery' },
                                ].map((t) => (
                                    <div
                                        key={t.label}
                                        className='flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-slate-50 text-center'
                                    >
                                        <t.icon className='w-5 h-5 text-slate-700' />
                                        <span className='text-xs font-medium text-slate-700'>
                                            {t.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Contact */}
                            <div className='flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-100'>
                                <MessageCircle className='w-5 h-5 text-green-600 shrink-0' />
                                <div className='flex-1 text-sm text-green-800'>
                                    Need help? Chat with our eBike experts on WhatsApp
                                </div>
                                <a
                                    href={`https://wa.me/2348012345678?text=Hi! I'm interested in the ${product.name}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-sm font-bold text-green-700 hover:text-green-900 whitespace-nowrap'
                                >
                                    Chat Now →
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Specs Table */}
                    {specs && Object.keys(specs).length > 0 && (
                        <div className='mt-16'>
                            <h2 className='text-2xl font-extrabold text-slate-900 mb-6'>
                                Technical Specifications
                            </h2>
                            <div className='rounded-3xl border border-slate-100 overflow-hidden'>
                                <table className='w-full text-sm'>
                                    <tbody>
                                        {Object.entries(specs).map(([key, value], i) => (
                                            <tr
                                                key={key}
                                                className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                                            >
                                                <td className='px-6 py-4 font-semibold text-slate-700 capitalize w-40'>
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </td>
                                                <td className='px-6 py-4 text-slate-600'>
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
                        <h2 className='text-2xl font-extrabold text-slate-900 mb-8'>
                            You Might Also Like
                        </h2>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                            {related.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/shop/${p.slug}`}
                                    className='group jv-card bg-white overflow-hidden'
                                >
                                    <div className='aspect-[4/3] bg-slate-50 rounded-t-3xl flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300'>
                                        🚴
                                    </div>
                                    <div className='p-5'>
                                        <p className='text-xs text-slate-400 mb-1'>
                                            {p.category.replace(/_/g, ' ')}
                                        </p>
                                        <h3 className='font-bold text-slate-900 group-hover:text-green-600 transition-colors mb-2'>
                                            {p.name}
                                        </h3>
                                        <span className='font-extrabold text-slate-900'>
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
