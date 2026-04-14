import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Calendar, Clock, Eye, Share2, Tag } from 'lucide-react'
// app/main/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
    const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true } })
    return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const post = await prisma.post.findUnique({ where: { slug } })
    if (!post) return {}
    return {
        title: post.title,
        description: post.excerpt,
    }
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post = await prisma.post.findUnique({
        where: { slug, published: true },
    })

    if (!post) notFound()

    // Increment view count (fire and forget)
    prisma.post
        .update({
            where: { id: post.id },
            data: { views: { increment: 1 } },
        })
        .catch(() => {})

    const related = await prisma.post.findMany({
        where: {
            published: true,
            category: post.category,
            NOT: { id: post.id },
        },
        take: 3,
        orderBy: { publishedAt: 'desc' },
    })

    const tags = post.tags ? post.tags.split(',').map((t) => t.trim()) : []

    return (
        <>
            {/* Hero */}
            <section className='pt-32 pb-0 bg-slate-950'>
                <div className='jv-container max-w-4xl'>
                    {/* Back */}
                    <Link
                        href='/blog'
                        className='inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-8'
                    >
                        <ArrowLeft className='w-4 h-4' />
                        Back to Blog
                    </Link>

                    {/* Category + meta */}
                    <div className='flex flex-wrap items-center gap-3 mb-5'>
                        <span className='jv-badge bg-green-500/20 text-green-400 border border-green-500/30'>
                            {post.category}
                        </span>
                        <span className='text-slate-500 text-sm flex items-center gap-1.5'>
                            <Clock className='w-3.5 h-3.5' /> {post.readTime} min read
                        </span>
                        <span className='text-slate-500 text-sm flex items-center gap-1.5'>
                            <Eye className='w-3.5 h-3.5' /> {post.views.toLocaleString()} views
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className='text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight'>
                        {post.title}
                    </h1>

                    {/* Author + date */}
                    <div className='flex items-center gap-4 pb-8 border-b border-slate-800'>
                        <div className='w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-sm'>
                            {post.author.charAt(0)}
                        </div>
                        <div>
                            <div className='text-white font-semibold text-sm'>{post.author}</div>
                            <div className='text-slate-500 text-xs flex items-center gap-1.5'>
                                <Calendar className='w-3 h-3' />
                                {post.publishedAt ? formatDate(post.publishedAt) : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cover image */}
            <div className='bg-slate-900'>
                <div className='jv-container max-w-4xl py-0'>
                    <div className='aspect-video rounded-b-3xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-8xl'>
                        📰
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className='jv-section bg-white'>
                <div className='jv-container max-w-4xl'>
                    <div className='grid lg:grid-cols-[1fr_280px] gap-12'>
                        {/* Article */}
                        <article
                            className='prose-jovico'
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Sidebar */}
                        <aside className='space-y-6'>
                            {/* Tags */}
                            {tags.length > 0 && (
                                <div className='jv-card p-5'>
                                    <h3 className='font-bold text-slate-900 text-sm mb-3 flex items-center gap-2'>
                                        <Tag className='w-4 h-4' /> Tags
                                    </h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className='jv-badge bg-slate-100 text-slate-600 text-xs'
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Share */}
                            <div className='jv-card p-5'>
                                <h3 className='font-bold text-slate-900 text-sm mb-3 flex items-center gap-2'>
                                    <Share2 className='w-4 h-4' /> Share This
                                </h3>
                                <div className='space-y-2'>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://jovicobikes.com/blog/${post.slug}`)}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors w-full'
                                    >
                                        Share on Twitter
                                    </a>
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(`${post.title} https://jovicobikes.com/blog/${post.slug}`)}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors w-full'
                                    >
                                        Share on WhatsApp
                                    </a>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className='jv-card p-5 bg-slate-900 text-white border-0'>
                                <div className='text-2xl mb-3'>⚡</div>
                                <h3 className='font-bold text-lg mb-2'>Ready to Ride Electric?</h3>
                                <p className='text-slate-400 text-sm mb-4'>
                                    Browse our full range of eBikes built for Lagos.
                                </p>
                                <Link href='/shop' className='jv-btn-green w-full justify-center'>
                                    Shop Now
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Related posts */}
            {related.length > 0 && (
                <section className='jv-section bg-slate-50'>
                    <div className='jv-container'>
                        <h2 className='text-2xl font-extrabold text-slate-900 mb-8'>
                            More Articles
                        </h2>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                            {related.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/blog/${p.slug}`}
                                    className='group jv-card bg-white overflow-hidden'
                                >
                                    <div className='aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl rounded-t-3xl'>
                                        📖
                                    </div>
                                    <div className='p-5'>
                                        <span className='jv-badge bg-slate-100 text-slate-500 text-xs mb-2'>
                                            {p.category}
                                        </span>
                                        <h3 className='font-bold text-slate-900 text-sm group-hover:text-green-600 transition-colors line-clamp-2'>
                                            {p.title}
                                        </h3>
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
