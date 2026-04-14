import { ArrowRight, Clock, Eye } from 'lucide-react'
import type { Metadata } from 'next'
// app/main/blog/page.tsx
import Link from 'next/link'

import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
    title: 'Blog',
    description:
        'eBike tips, Lagos riding guides, product reviews and news from the Jovico Bikes team.',
}

const CATEGORIES = ['ALL', 'NEWS', 'TIPS', 'REVIEW', 'GUIDE', 'COMPANY']

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>
}) {
    const params = await searchParams
    const category = params.category?.toUpperCase()

    const posts = await prisma.post.findMany({
        where: {
            published: true,
            ...(category && category !== 'ALL' ? { category: category as any } : {}),
        },
        orderBy: { publishedAt: 'desc' },
    })

    const featured = posts.find((p) => p.featured)
    const rest = posts.filter((p) => p.id !== featured?.id)

    return (
        <>
            {/* Hero */}
            <section className='pt-32 pb-16 bg-slate-950'>
                <div className='jv-container'>
                    <p className='text-green-400 font-semibold text-sm uppercase tracking-wider mb-2'>
                        Riding Insights
                    </p>
                    <h1 className='text-5xl md:text-6xl font-extrabold text-white mb-4'>
                        The Jovico Blog
                    </h1>
                    <p className='text-slate-400 text-lg max-w-xl'>
                        Tips, guides, news and stories from Lagos's eBike community.
                    </p>
                </div>
            </section>

            {/* Category filter */}
            <section className='sticky top-[72px] z-30 bg-white border-b border-slate-100 shadow-sm'>
                <div className='jv-container py-4'>
                    <div className='flex gap-2 overflow-x-auto pb-1'>
                        {CATEGORIES.map((cat) => {
                            const isActive = (!category && cat === 'ALL') || category === cat
                            return (
                                <Link
                                    key={cat}
                                    href={
                                        cat === 'ALL'
                                            ? '/blog'
                                            : `/blog?category=${cat.toLowerCase()}`
                                    }
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {cat === 'ALL'
                                        ? 'All Posts'
                                        : cat.charAt(0) + cat.slice(1).toLowerCase()}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className='jv-section bg-slate-50'>
                <div className='jv-container'>
                    {posts.length === 0 ? (
                        <div className='text-center py-20'>
                            <div className='text-6xl mb-4'>📝</div>
                            <h2 className='text-2xl font-bold text-slate-900 mb-2'>
                                No posts found
                            </h2>
                            <p className='text-slate-500'>
                                Check back soon — we publish new content every week.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Featured post */}
                            {featured && !category && (
                                <Link href={`/blog/${featured.slug}`} className='group block mb-10'>
                                    <div className='jv-card overflow-hidden grid md:grid-cols-2 gap-0'>
                                        <div className='aspect-video md:aspect-auto bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-7xl rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none'>
                                            📰
                                        </div>
                                        <div className='p-8 md:p-10 flex flex-col justify-center'>
                                            <div className='flex items-center gap-2 mb-4'>
                                                <span className='jv-badge bg-green-100 text-green-700 text-xs'>
                                                    Featured
                                                </span>
                                                <span className='jv-badge bg-slate-100 text-slate-600 text-xs'>
                                                    {featured.category}
                                                </span>
                                            </div>
                                            <h2 className='text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 group-hover:text-green-600 transition-colors'>
                                                {featured.title}
                                            </h2>
                                            <p className='text-slate-500 text-sm leading-relaxed mb-5 line-clamp-3'>
                                                {featured.excerpt}
                                            </p>
                                            <div className='flex items-center gap-4 text-xs text-slate-400 mb-5'>
                                                <span className='flex items-center gap-1'>
                                                    <Clock className='w-3.5 h-3.5' />{' '}
                                                    {featured.readTime} min read
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <Eye className='w-3.5 h-3.5' />{' '}
                                                    {featured.views.toLocaleString()} views
                                                </span>
                                                <span>
                                                    {featured.publishedAt
                                                        ? formatDate(featured.publishedAt)
                                                        : ''}
                                                </span>
                                            </div>
                                            <span className='flex items-center gap-1.5 text-sm font-bold text-green-600 group-hover:gap-3 transition-all'>
                                                Read Article <ArrowRight className='w-4 h-4' />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Grid */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {rest.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/blog/${post.slug}`}
                                        className='group jv-card bg-white overflow-hidden'
                                    >
                                        <div className='aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl rounded-t-3xl'>
                                            📖
                                        </div>
                                        <div className='p-6'>
                                            <div className='flex items-center gap-2 mb-3'>
                                                <span className='jv-badge bg-slate-100 text-slate-500 text-xs'>
                                                    {post.category}
                                                </span>
                                                <span className='text-xs text-slate-400 flex items-center gap-1'>
                                                    <Clock className='w-3 h-3' /> {post.readTime}{' '}
                                                    min
                                                </span>
                                            </div>
                                            <h3 className='font-bold text-slate-900 text-base mb-2 group-hover:text-green-600 transition-colors line-clamp-2'>
                                                {post.title}
                                            </h3>
                                            <p className='text-slate-500 text-sm line-clamp-2 mb-4'>
                                                {post.excerpt}
                                            </p>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-xs text-slate-400'>
                                                    {post.publishedAt
                                                        ? formatDate(post.publishedAt)
                                                        : ''}
                                                </span>
                                                <span className='flex items-center gap-1 text-xs font-bold text-green-600'>
                                                    Read <ArrowRight className='w-3.5 h-3.5' />
                                                </span>
                                            </div>
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
