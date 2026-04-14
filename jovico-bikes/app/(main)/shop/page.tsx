// app/main/shop/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, SlidersHorizontal, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatNaira } from '@/lib/utils'
import { ProductCategory } from '@/prisma/generated/prisma/enums'

export const metadata: Metadata = {
    title: 'Shop eBikes',
    description:
        'Browse the full Jovico Bikes collection. City bikes, mountain bikes, cargo bikes and folding bikes — all built for Lagos.',
}

const CATEGORIES = [
    { value: 'ALL', label: 'All Bikes' },
    { value: 'CITY_BIKE', label: 'City Bikes' },
    { value: 'MOUNTAIN_BIKE', label: 'Mountain' },
    { value: 'CARGO_BIKE', label: 'Cargo' },
    { value: 'FOLDING_BIKE', label: 'Folding' },
    { value: 'ROAD_BIKE', label: 'Road' },
]

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; sort?: string; q?: string }>
}) {
    const params = await searchParams
    const category = params.category?.toUpperCase() as ProductCategory | undefined
    const sort = params.sort ?? 'featured'
    const query = params.q ?? ''

    const products = await prisma.product.findMany({
        where: {
            published: true,
            type: 'BIKE',
            ...(category && category.valueOf() !== 'ALL' ? { category } : {}),
            ...(query
                ? {
                      OR: [{ name: { contains: query } }, { description: { contains: query } }],
                  }
                : {}),
        },
        include: { images: { where: { isPrimary: true }, take: 1 } },
        orderBy:
            sort === 'price-asc'
                ? { price: 'asc' }
                : sort === 'price-desc'
                  ? { price: 'desc' }
                  : sort === 'newest'
                    ? { createdAt: 'desc' }
                    : { featured: 'desc' },
    })

    return (
        <>
            {/* Hero */}
            <section className='pt-32 pb-14 bg-slate-950'>
                <div className='jv-container'>
                    <p className='text-green-400 font-semibold text-sm uppercase tracking-wider mb-2'>
                        Our Collection
                    </p>
                    <h1 className='text-5xl md:text-6xl font-extrabold text-white mb-4'>
                        Shop eBikes
                    </h1>
                    <p className='text-slate-400 text-lg max-w-lg'>
                        Premium electric bikes for every Lagos lifestyle. From city commuter to
                        off-road explorer.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className='sticky top-[72px] z-30 bg-white border-b border-slate-100 shadow-sm'>
                <div className='jv-container py-4'>
                    <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
                        {/* Category tabs */}
                        <div className='flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide'>
                            {CATEGORIES.map((cat) => {
                                const isActive =
                                    (!params.category && cat.value === 'ALL') ||
                                    params.category?.toUpperCase() === cat.value
                                return (
                                    <Link
                                        key={cat.value}
                                        href={`/shop?category=${cat.value.toLowerCase()}&sort=${sort}${query ? `&q=${query}` : ''}`}
                                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {cat.label}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Sort + Search */}
                        <div className='flex items-center gap-3'>
                            <form className='relative'>
                                <input
                                    type='text'
                                    name='q'
                                    defaultValue={query}
                                    placeholder='Search bikes...'
                                    className='pl-9 pr-4 py-2 rounded-full text-sm border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent w-40 focus:w-52 transition-all'
                                />
                                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                            </form>
                            <select
                                defaultValue={sort}
                                className='pl-3 pr-8 py-2 rounded-full text-sm border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none cursor-pointer'
                                onChange={(e) => {
                                    const url = new URL(window.location.href)
                                    url.searchParams.set('sort', e.target.value)
                                    window.location.href = url.toString()
                                }}
                            >
                                <option value='featured'>Featured</option>
                                <option value='newest'>Newest</option>
                                <option value='price-asc'>Price: Low–High</option>
                                <option value='price-desc'>Price: High–Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className='jv-section bg-slate-50'>
                <div className='jv-container'>
                    {products.length === 0 ? (
                        <div className='text-center py-24'>
                            <div className='text-6xl mb-4'>🚴</div>
                            <h2 className='text-2xl font-bold text-slate-900 mb-2'>
                                No bikes found
                            </h2>
                            <p className='text-slate-500 mb-6'>
                                Try adjusting your filters or search term.
                            </p>
                            <Link href='/shop' className='jv-btn-primary'>
                                View All Bikes
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className='text-sm text-slate-500 mb-6'>
                                {products.length} bikes found
                            </p>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/shop/${product.slug}`}
                                        className='group jv-card overflow-hidden bg-white'
                                    >
                                        {/* Image */}
                                        <div className='relative aspect-[4/3] bg-slate-50 rounded-t-3xl overflow-hidden'>
                                            <div className='absolute inset-0 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500'>
                                                🚴
                                            </div>
                                            {product.stock === 0 && (
                                                <div className='absolute inset-0 bg-white/70 flex items-center justify-center'>
                                                    <span className='jv-badge bg-slate-700 text-white text-xs'>
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                            <div className='absolute top-3 left-3 flex flex-col gap-1.5'>
                                                {product.salePrice && (
                                                    <span className='jv-badge bg-red-500 text-white text-xs'>
                                                        SALE
                                                    </span>
                                                )}
                                                {product.featured && (
                                                    <span className='jv-badge bg-green-500 text-white text-xs'>
                                                        Popular
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className='p-5'>
                                            <p className='text-xs font-medium text-slate-400 uppercase tracking-wider mb-1'>
                                                {product.category.replace(/_/g, ' ')}
                                            </p>
                                            <h3 className='font-bold text-slate-900 text-base mb-1 group-hover:text-green-600 transition-colors line-clamp-1'>
                                                {product.name}
                                            </h3>
                                            <p className='text-xs text-slate-400 mb-3 line-clamp-2'>
                                                {product.description}
                                            </p>

                                            {/* Specs preview */}
                                            {product.specs && typeof product.specs === 'object' && (
                                                <div className='flex gap-3 mb-3'>
                                                    {Object.entries(
                                                        product.specs as Record<string, string>
                                                    )
                                                        .slice(0, 2)
                                                        .map(([key, val]) => (
                                                            <div
                                                                key={key}
                                                                className='flex-1 bg-slate-50 rounded-xl px-3 py-2 text-center'
                                                            >
                                                                <div className='text-xs font-bold text-slate-900 truncate'>
                                                                    {val}
                                                                </div>
                                                                <div className='text-[10px] text-slate-400 capitalize'>
                                                                    {key.replace(/([A-Z])/g, ' $1')}
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}

                                            <div className='flex items-center justify-between'>
                                                <div>
                                                    <span className='text-lg font-extrabold text-slate-900'>
                                                        {formatNaira(Number(product.price))}
                                                    </span>
                                                    {product.salePrice && (
                                                        <span className='text-xs text-slate-400 line-through ml-1.5'>
                                                            {formatNaira(Number(product.salePrice))}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className='w-9 h-9 rounded-full bg-slate-900 group-hover:bg-green-500 flex items-center justify-center transition-colors'>
                                                    <ArrowRight className='w-4 h-4 text-white' />
                                                </div>
                                            </div>
                                            {product.stock > 0 && product.stock < 5 && (
                                                <p className='text-xs text-orange-500 font-medium mt-2'>
                                                    Only {product.stock} left
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    )
}
