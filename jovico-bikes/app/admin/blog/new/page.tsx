import { BlogPostEditor } from '@/components/admin/BlogPostEditor'
// app/admin/blog/new/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Post' }

export default function NewPostPage() {
    return (
        <div className='max-w-4xl mx-auto'>
            <h1 className='text-2xl font-extrabold text-slate-900 mb-8'>New Blog Post</h1>
            <BlogPostEditor post={null} mode='create' />
        </div>
    )
}
