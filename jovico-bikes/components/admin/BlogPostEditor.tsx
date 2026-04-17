'use client'
import type { PostEditorData, PostFormState } from '@/types'
import type { PostCategory } from '@prisma/client'
import CharacterCount from '@tiptap/extension-character-count'
import TiptapLink from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TiptapUnderline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
    Bold,
    Code,
    Eye,
    Heading2,
    Heading3,
    Italic,
    Link2,
    List,
    ListOrdered,
    Loader2,
    Minus,
    Quote,
    Redo2,
    Save,
    Star,
    Underline as UnderlineIcon,
    Undo2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
// components/admin/BlogPostEditor.tsx
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface Props {
    post: PostEditorData | null
    mode: 'create' | 'edit'
}

const CATEGORIES: PostCategory[] = ['NEWS', 'TIPS', 'REVIEW', 'GUIDE', 'COMPANY']

// ── Toolbar button ────────────────────────────────────────
function ToolbarBtn({
    onClick,
    active = false,
    disabled = false,
    title,
    children,
}: {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    title: string
    children: React.ReactNode
}) {
    return (
        <button
            type='button'
            onMouseDown={(e) => {
                e.preventDefault()
                onClick()
            }}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-lg text-sm transition-colors ${
                active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            } disabled:opacity-30`}
        >
            {children}
        </button>
    )
}

export function BlogPostEditor({ post, mode }: Props) {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState<PostFormState>({
        title: post?.title ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? '',
        category: post?.category ?? 'NEWS',
        tags: post?.tags ?? '',
        author: post?.author ?? 'Jovico Team',
        published: post?.published ?? false,
        featured: post?.featured ?? false,
    })

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
                codeBlock: false,
            }),
            TiptapUnderline,
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-green-600 underline' },
            }),
            Placeholder.configure({ placeholder: 'Start writing your post here…' }),
            CharacterCount,
        ],
        content: post?.content ?? '',
        onUpdate: ({ editor: e }: { editor: any }) => {
            setForm((f) => ({ ...f, content: e.getHTML() }))
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none min-h-[400px] focus:outline-none px-5 py-4 text-slate-700 leading-relaxed',
            },
        },
    })

    const setLink = useCallback(() => {
        if (!editor) return
        const prev = editor.getAttributes('link').href as string | undefined
        const url = window.prompt('Enter URL', prev ?? 'https://')
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    function setField<K extends keyof PostFormState>(key: K, value: PostFormState[K]) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function handleSave(publishNow?: boolean) {
        if (!form.title.trim() || !form.content || form.content === '<p></p>') {
            toast.error('Title and content are required.')
            return
        }
        setSaving(true)
        try {
            const payload: PostFormState = { ...form, published: publishNow ?? form.published }
            const url = mode === 'edit' ? `/api/blog/${post!.id}` : '/api/blog'
            const method = mode === 'edit' ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const err: { error?: string } = await res.json()
                throw new Error(err.error ?? 'Save failed')
            }

            toast.success(mode === 'create' ? 'Post created!' : 'Post saved!')
            router.push('/admin/blog')
            router.refresh()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }

    const wordCount = editor?.storage.characterCount.words() ?? 0
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    return (
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 lg:gap-6'>
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
                        onChange={(e) => setField('title', e.target.value)}
                        placeholder='Enter a compelling post title…'
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
                        onChange={(e) => setField('excerpt', e.target.value)}
                        rows={3}
                        placeholder='Brief summary shown in listings and SEO…'
                        className='jv-input resize-none'
                    />
                    <p className='text-xs text-slate-400 mt-1'>{form.excerpt.length} / 300 chars</p>
                </div>

                {/* Rich-text content */}
                <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                    <div className='border-b border-slate-100 px-3 py-2 flex flex-wrap gap-0.5 items-center bg-slate-50'>
                        {/* Undo/Redo */}
                        <ToolbarBtn
                            onClick={() => editor?.chain().focus().undo().run()}
                            title='Undo'
                            disabled={!editor?.can().undo()}
                        >
                            <Undo2 className='w-4 h-4' />
                        </ToolbarBtn>
                        <ToolbarBtn
                            onClick={() => editor?.chain().focus().redo().run()}
                            title='Redo'
                            disabled={!editor?.can().redo()}
                        >
                            <Redo2 className='w-4 h-4' />
                        </ToolbarBtn>

                        <div className='w-px h-5 bg-slate-200 mx-1' />

                        {/* Headings */}
                        <ToolbarBtn
                            onClick={() =>
                                editor?.chain().focus().toggleHeading({ level: 2 }).run()
                            }
                            title='Heading 2'
                            active={editor?.isActive('heading', { level: 2 })}
                        >
                            <Heading2 className='w-4 h-4' />
                        </ToolbarBtn>
                        <ToolbarBtn
                            onClick={() =>
                                editor?.chain().focus().toggleHeading({ level: 3 }).run()
                            }
                            title='Heading 3'
                            active={editor?.isActive('heading', { level: 3 })}
                        >
                            <Heading3 className='w-4 h-4' />
                        </ToolbarBtn>

                        <div className='w-px h-5 bg-slate-200 mx-1' />

                        {/* Text formatting */}
                        <ToolbarBtn
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            title='Bold'
                            active={editor?.isActive('bold')}
                        >
                            <Bold className='w-4 h-4' />
                        </ToolbarBtn>
                        <ToolbarBtn
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            title='Italic'
                            active={editor?.isActive('italic')}
                        >
                            <Italic className='w-4 h-4' />
                        </ToolbarBtn>
                        <ToolbarBtn
                            onClick={() => editor?.chain().focus().toggleUnderline().run()}
                            title='Underline'
                            active={editor?.isActive('underline')}
                        >
                            <UnderlineIcon className='w-4 h-4' />
                        </ToolbarBtn>
                        <ToolbarBtn
                            onClick={() => editor?.chain().focus().toggleCode().run()}
                            title='Inline code'
                            active={editor?.isActive('code')}
                        >
                            <Code className='w-4 h-4' />
                        </ToolbarBtn>

                        <div className='w-px h-5 bg-slate-200 mx-1' />

                        {/* Lists */}
                        <ToolbarBtn
                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            title='Bullet list'
                            active={editor?.isActive('bulletList')}
                        >
                            <List className='w-4 h-4' />
                        </ToolbarBtn>
                        <ToolbarBtn
                            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            title='Ordered list'
                            active={editor?.isActive('orderedList')}
                        >
                            <ListOrdered className='w-4 h-4' />
                        </ToolbarBtn>
                        <ToolbarBtn
                            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                            title='Quote'
                            active={editor?.isActive('blockquote')}
                        >
                            <Quote className='w-4 h-4' />
                        </ToolbarBtn>
                        <ToolbarBtn
                            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                            title='Divider'
                        >
                            <Minus className='w-4 h-4' />
                        </ToolbarBtn>

                        <div className='w-px h-5 bg-slate-200 mx-1' />

                        {/* Link */}
                        <ToolbarBtn
                            onClick={setLink}
                            title='Insert link'
                            active={editor?.isActive('link')}
                        >
                            <Link2 className='w-4 h-4' />
                        </ToolbarBtn>

                        {/* Word count */}
                        <span className='ml-auto text-xs text-slate-400 pr-2'>
                            {wordCount} words · ~{readTime} min read
                        </span>
                    </div>

                    <EditorContent editor={editor} />
                </div>

                {/* Action buttons */}
                <div className='flex flex-col sm:flex-row gap-3'>
                    <button
                        type='button'
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className='jv-btn-secondary flex-1 justify-center !border-slate-200 !text-slate-700 hover:!bg-slate-50'
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

            {/* Sidebar */}
            <div className='space-y-5'>
                {/* Status toggles */}
                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <h3 className='font-bold text-slate-900 text-sm mb-4'>Post Settings</h3>
                    <div className='space-y-4'>
                        {(['published', 'featured'] as const).map((key) => (
                            <label
                                key={key}
                                className='flex items-center justify-between cursor-pointer'
                            >
                                <div className='flex items-center gap-2'>
                                    {key === 'featured' ? (
                                        <Star
                                            className={`w-4 h-4 ${form[key] ? 'text-yellow-500' : 'text-slate-400'}`}
                                        />
                                    ) : (
                                        <Eye
                                            className={`w-4 h-4 ${form[key] ? 'text-green-500' : 'text-slate-400'}`}
                                        />
                                    )}
                                    <span className='text-sm font-medium text-slate-700'>
                                        {key === 'published' ? 'Published' : 'Featured'}
                                    </span>
                                </div>
                                <button
                                    type='button'
                                    role='switch'
                                    aria-checked={form[key]}
                                    onClick={() => setField(key, !form[key])}
                                    className={`w-10 rounded-full transition-colors relative flex-shrink-0 ${
                                        form[key]
                                            ? key === 'featured'
                                                ? 'bg-yellow-400'
                                                : 'bg-green-500'
                                            : 'bg-slate-200'
                                    }`}
                                    style={{ height: '1.375rem' }}
                                >
                                    <span
                                        className={`absolute top-0.5 rounded-full bg-white shadow transition-transform ${
                                            form[key] ? 'translate-x-5' : 'translate-x-0.5'
                                        }`}
                                        style={{ width: '1.125rem', height: '1.125rem' }}
                                    />
                                </button>
                            </label>
                        ))}
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
                                onClick={() => setField('category', cat)}
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
                        onChange={(e) => setField('author', e.target.value)}
                        className='jv-input text-sm'
                    />
                </div>

                {/* Tags */}
                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <label className='block text-sm font-bold text-slate-900 mb-1.5'>Tags</label>
                    <input
                        type='text'
                        value={form.tags}
                        onChange={(e) => setField('tags', e.target.value)}
                        className='jv-input text-sm'
                        placeholder='lagos, ebike, tips'
                    />
                    <p className='text-xs text-slate-400 mt-1.5'>Separate tags with commas</p>
                </div>
            </div>
        </div>
    )
}
