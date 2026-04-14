'use client'
// components/admin/BlogPostEditor.tsx
import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, Eye, EyeOff, Star } from 'lucide-react'
import { Post } from '@/prisma/generated/prisma/client'

// import type { Post } from "@prisma/client";

interface Props {
    post: Post | null
    mode: 'create' | 'edit'
}

const CATEGORIES = ['NEWS', 'TIPS', 'REVIEW', 'GUIDE', 'COMPANY']

export function BlogPostEditor({ post, mode }: Props) {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        title: post?.title ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? '',
        category: post?.category ?? 'NEWS',
        tags: post?.tags ?? '',
        author: post?.author ?? 'Jovico Team',
        published: post?.published ?? false,
        featured: post?.featured ?? false,
    })

    function update(key: string, value: string | boolean) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function handleSave(publishNow?: boolean) {
        if (!form.title.trim() || !form.content.trim()) {
            toast.error('Title and content are required.')
            return
        }
        setSaving(true)
        try {
            const payload = { ...form, published: publishNow ?? form.published }
            const url = mode === 'edit' ? `/api/blog/${post!.id}` : '/api/blog'
            const method = mode === 'edit' ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? 'Save failed')
            }

            toast.success(mode === 'create' ? 'Post created!' : 'Post saved!')
            router.push('/admin/blog')
            router.refresh()
        } catch (err: any) {
            toast.error(err.message ?? 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className='grid lg:grid-cols-[1fr_280px] gap-6'>
            {/* Main editor */}
            <div className='space-y-5'>
                {/* Title */}
                <div className='bg-white rounded-2xl border border-slate-100 p-6'>
                    <label className='block text-sm font-semibold text-slate-700 mb-2'>
                        Post Title *
                    </label>
                    <input
                        type='text'
                        value={form.title}
                        onChange={(e) => update('title', e.target.value)}
                        placeholder='Enter a compelling post title...'
                        className='jv-input text-lg font-semibold'
                    />
                </div>

                {/* Excerpt */}
                <div className='bg-white rounded-2xl border border-slate-100 p-6'>
                    <label className='block text-sm font-semibold text-slate-700 mb-2'>
                        Excerpt *
                    </label>
                    <textarea
                        value={form.excerpt}
                        onChange={(e) => update('excerpt', e.target.value)}
                        rows={3}
                        placeholder='Write a brief summary of this post (shown in listings and SEO)...'
                        className='jv-input resize-none'
                    />
                    <p className='text-xs text-slate-400 mt-1'>{form.excerpt.length} / 300 chars</p>
                </div>

                {/* Content */}
                <div className='bg-white rounded-2xl border border-slate-100 p-6'>
                    <label className='block text-sm font-semibold text-slate-700 mb-2'>
                        Content *
                    </label>
                    <p className='text-xs text-slate-400 mb-3'>
                        You can use basic HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;,
                        &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;
                    </p>
                    <textarea
                        value={form.content}
                        onChange={(e) => update('content', e.target.value)}
                        rows={20}
                        placeholder='<h2>Introduction</h2><p>Start writing your post here...</p>'
                        className='jv-input resize-y font-mono text-sm'
                    />
                    <p className='text-xs text-slate-400 mt-1'>
                        ~{Math.ceil(form.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)}{' '}
                        min read
                    </p>
                </div>

                {/* Action buttons */}
                <div className='flex gap-3'>
                    <button
                        type='button'
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className='jv-btn-secondary flex-1 justify-center'
                    >
                        {saving ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                            <Save className='w-4 h-4' />
                        )}
                        Save Draft
                    </button>
                    <button
                        type='button'
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className='jv-btn-primary flex-1 justify-center'
                    >
                        {saving ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                            <Eye className='w-4 h-4' />
                        )}
                        {form.published ? 'Update & Keep Published' : 'Save & Publish'}
                    </button>
                </div>
            </div>

            {/* Sidebar: settings */}
            <div className='space-y-5'>
                {/* Status */}
                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <h3 className='font-bold text-slate-900 text-sm mb-4'>Post Settings</h3>
                    <div className='space-y-4'>
                        {/* Published toggle */}
                        <label className='flex items-center justify-between cursor-pointer'>
                            <div className='flex items-center gap-2'>
                                {form.published ? (
                                    <Eye className='w-4 h-4 text-green-500' />
                                ) : (
                                    <EyeOff className='w-4 h-4 text-slate-400' />
                                )}
                                <span className='text-sm font-medium text-slate-700'>
                                    Published
                                </span>
                            </div>
                            <button
                                type='button'
                                role='switch'
                                aria-checked={form.published}
                                onClick={() => update('published', !form.published)}
                                className={`w-10 h-5.5 rounded-full transition-colors relative ${
                                    form.published ? 'bg-green-500' : 'bg-slate-200'
                                }`}
                                style={{ height: '1.375rem' }}
                            >
                                <span
                                    className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                                        form.published ? 'translate-x-5' : 'translate-x-0.5'
                                    }`}
                                    style={{ width: '1.125rem', height: '1.125rem' }}
                                />
                            </button>
                        </label>

                        {/* Featured toggle */}
                        <label className='flex items-center justify-between cursor-pointer'>
                            <div className='flex items-center gap-2'>
                                <Star
                                    className={`w-4 h-4 ${form.featured ? 'text-yellow-500' : 'text-slate-400'}`}
                                />
                                <span className='text-sm font-medium text-slate-700'>Featured</span>
                            </div>
                            <button
                                type='button'
                                role='switch'
                                aria-checked={form.featured}
                                onClick={() => update('featured', !form.featured)}
                                className={`w-10 rounded-full transition-colors relative ${
                                    form.featured ? 'bg-yellow-400' : 'bg-slate-200'
                                }`}
                                style={{ height: '1.375rem' }}
                            >
                                <span
                                    className={`absolute top-0.5 rounded-full bg-white shadow transition-transform ${
                                        form.featured ? 'translate-x-5' : 'translate-x-0.5'
                                    }`}
                                    style={{ width: '1.125rem', height: '1.125rem' }}
                                />
                            </button>
                        </label>
                    </div>
                </div>

                {/* Category */}
                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <h3 className='font-bold text-slate-900 text-sm mb-3'>Category</h3>
                    <div className='grid grid-cols-2 gap-2'>
                        {CATEGORIES.map((cat) => (
                            <button
                                type='button'
                                key={cat}
                                onClick={() => update('category', cat)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                    form.category === cat
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {cat.charAt(0) + cat.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Author */}
                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <label className='block text-sm font-bold text-slate-900 mb-2'>Author</label>
                    <input
                        type='text'
                        value={form.author}
                        onChange={(e) => update('author', e.target.value)}
                        className='jv-input text-sm'
                        placeholder='Author name'
                    />
                </div>

                {/* Tags */}
                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <label className='block text-sm font-bold text-slate-900 mb-1.5'>Tags</label>
                    <input
                        type='text'
                        value={form.tags}
                        onChange={(e) => update('tags', e.target.value)}
                        className='jv-input text-sm'
                        placeholder='lagos, ebike, tips (comma-separated)'
                    />
                    <p className='text-xs text-slate-400 mt-1.5'>Separate tags with commas</p>
                </div>
            </div>
        </div>
    )
}
