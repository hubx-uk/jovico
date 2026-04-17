import { AdminDeletePost } from '@/components/admin/AdminDeletePost'
import { AdminTogglePost } from '@/components/admin/AdminTogglePost'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Eye, Pencil, Plus } from 'lucide-react'
// app/admin/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Blog Posts' }

export const dynamic = 'force-dynamic' // always fresh

export default async function AdminBlogPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className='max-w-6xl mx-auto'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8'>
                <div>
                    <h1 className='text-2xl font-extrabold text-slate-900'>Blog Posts</h1>
                    <p className='text-slate-500 text-sm mt-0.5'>{posts.length} total posts</p>
                </div>
                <Link href='/admin/blog/new' className='jv-btn-primary'>
                    <Plus className='w-4 h-4' /> New Post
                </Link>
            </div>

            {/* Table */}
            <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                {posts.length === 0 ? (
                    <div className='py-20 text-center text-slate-400'>
                        <div className='text-4xl mb-3'>📝</div>
                        <p className='font-semibold text-slate-600'>No posts yet</p>
                        <p className='text-sm mt-1 mb-6'>
                            Create your first blog post to get started.
                        </p>
                        <Link href='/admin/blog/new' className='jv-btn-primary'>
                            <Plus className='w-4 h-4' /> New Post
                        </Link>
                    </div>
                ) : (
                    <div className='overflow-x-auto -mx-4 sm:mx-0'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b border-slate-100 bg-slate-50'>
                                    <th className='text-left px-6 py-3.5 font-semibold text-slate-600'>
                                        Title
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Category
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Author
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Status
                                    </th>
                                    <th className='hidden md:table-cell text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Views
                                    </th>
                                    <th className='hidden md:table-cell text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Date
                                    </th>
                                    <th className='text-right px-6 py-3.5 font-semibold text-slate-600'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-50'>
                                {posts.map((post) => (
                                    <tr
                                        key={post.id}
                                        className='hover:bg-slate-50 transition-colors'
                                    >
                                        <td className='px-6 py-4'>
                                            <div className='font-semibold text-slate-900 line-clamp-1 max-w-xs'>
                                                {post.title}
                                            </div>
                                            <div className='text-xs text-slate-400 mt-0.5 line-clamp-1'>
                                                {post.excerpt}
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span className='jv-badge bg-slate-100 text-slate-600 text-xs'>
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className='hidden sm:table-cell px-4 py-4 text-slate-600'>
                                            {post.author}
                                        </td>
                                        <td className='px-4 py-4'>
                                            <AdminTogglePost
                                                id={post.id}
                                                published={post.published}
                                            />
                                        </td>
                                        <td className='hidden md:table-cell px-4 py-4 text-slate-600'>
                                            {post.views.toLocaleString()}
                                        </td>
                                        <td className='hidden md:table-cell px-4 py-4 text-slate-500 text-xs whitespace-nowrap'>
                                            {formatDate(post.createdAt)}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center justify-end gap-2'>
                                                {post.published && (
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        target='_blank'
                                                        className='p-2 rounded-xl text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors'
                                                        title='View post'
                                                    >
                                                        <Eye className='w-4 h-4' />
                                                    </Link>
                                                )}
                                                <Link
                                                    href={`/admin/blog/${post.id}`}
                                                    className='p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors'
                                                    title='Edit post'
                                                >
                                                    <Pencil className='w-4 h-4' />
                                                </Link>
                                                <AdminDeletePost id={post.id} title={post.title} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
