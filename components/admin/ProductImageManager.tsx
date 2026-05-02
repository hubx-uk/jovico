'use client'
// components/admin/ProductImageManager.tsx
import { Upload, Star, Trash2, Loader2, Plus, Link2, X, ImageIcon } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ProductImage {
    id: string
    url: string
    alt: string | null
    isPrimary: boolean
}

interface Props {
    productId: string
    initialImages: ProductImage[]
}

export function ProductImageManager({ productId, initialImages }: Props) {
    const [images, setImages] = useState<ProductImage[]>(initialImages)
    const [uploading, setUploading] = useState(false)
    const [urlInput, setUrlInput] = useState('')
    const [showUrlInput, setShowUrlInput] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [settingPrimaryId, setSettingPrimaryId] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // ── Upload file ─────────────────────────────────────────────
    const handleFileUpload = useCallback(
        async (files: FileList | null) => {
            if (!files || files.length === 0) return
            setUploading(true)

            for (const file of Array.from(files)) {
                if (!file.type.startsWith('image/')) {
                    toast.error(`${file.name} is not an image`)
                    continue
                }
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`${file.name} exceeds 5MB limit`)
                    continue
                }

                const fd = new FormData()
                fd.append('file', file)
                fd.append('alt', file.name.replace(/\.[^.]+$/, ''))

                try {
                    const res = await fetch(`/api/products/${productId}/images`, {
                        method: 'POST',
                        body: fd,
                    })
                    if (!res.ok) throw new Error()
                    const img: ProductImage = await res.json()
                    setImages((prev) => [...prev, img])
                    toast.success(`${file.name} uploaded`)
                } catch {
                    toast.error(`Failed to upload ${file.name}`)
                }
            }
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        },
        [productId]
    )

    // ── Add by URL ───────────────────────────────────────────────
    async function handleAddUrl() {
        if (!urlInput.trim()) return
        setUploading(true)
        try {
            const res = await fetch(`/api/products/${productId}/images`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlInput.trim(), alt: '' }),
            })
            if (!res.ok) throw new Error()
            const img: ProductImage = await res.json()
            setImages((prev) => [...prev, img])
            setUrlInput('')
            setShowUrlInput(false)
            toast.success('Image added')
        } catch {
            toast.error('Failed to add image')
        } finally {
            setUploading(false)
        }
    }

    // ── Set primary ──────────────────────────────────────────────
    async function handleSetPrimary(imageId: string) {
        if (images.find((i) => i.id === imageId)?.isPrimary) return
        setSettingPrimaryId(imageId)
        try {
            const res = await fetch(`/api/products/${productId}/images/${imageId}`, {
                method: 'PATCH',
            })
            if (!res.ok) throw new Error()
            setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === imageId })))
            toast.success('Primary image updated')
        } catch {
            toast.error('Failed to update primary')
        } finally {
            setSettingPrimaryId(null)
        }
    }

    // ── Delete ───────────────────────────────────────────────────
    async function handleDelete(imageId: string) {
        setDeletingId(imageId)
        try {
            const res = await fetch(`/api/products/${productId}/images/${imageId}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error()
            setImages((prev) => {
                const filtered = prev.filter((i) => i.id !== imageId)
                // If we deleted the primary, promote first remaining
                const hadPrimary = prev.find((i) => i.id === imageId)?.isPrimary
                if (hadPrimary && filtered.length > 0) {
                    filtered[0] = { ...filtered[0], isPrimary: true }
                }
                return filtered
            })
            toast.success('Image removed')
        } catch {
            toast.error('Failed to remove image')
        } finally {
            setDeletingId(null)
        }
    }

    // ── Drag & drop ──────────────────────────────────────────────
    const [isDragging, setIsDragging] = useState(false)

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault()
        setIsDragging(true)
    }
    function handleDragLeave() {
        setIsDragging(false)
    }
    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        setIsDragging(false)
        handleFileUpload(e.dataTransfer.files)
    }

    return (
        <div className='bg-white rounded-2xl border border-slate-100 p-6 space-y-5'>
            <div className='flex items-center justify-between'>
                <h2 className='font-bold text-slate-900'>
                    Product Images{' '}
                    <span className='text-slate-400 font-normal text-sm'>({images.length})</span>
                </h2>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={() => setShowUrlInput((v) => !v)}
                        className='flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100'
                    >
                        <Link2 className='w-3.5 h-3.5' />
                        Add URL
                    </button>
                    <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className='flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white px-3 py-2 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-60'
                    >
                        {uploading ? (
                            <Loader2 className='w-3.5 h-3.5 animate-spin' />
                        ) : (
                            <Upload className='w-3.5 h-3.5' />
                        )}
                        Upload
                    </button>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                title='hideFile'
                ref={fileInputRef}
                type='file'
                accept='image/*'
                multiple
                className='hidden'
                onChange={(e) => handleFileUpload(e.target.files)}
            />

            {/* URL input */}
            {showUrlInput && (
                <div className='flex gap-2'>
                    <input
                        type='url'
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder='https://example.com/image.jpg'
                        className='jv-input flex-1 text-sm'
                        onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                    />
                    <button
                        title='add'
                        type='button'
                        onClick={handleAddUrl}
                        disabled={uploading || !urlInput}
                        className='jv-btn-primary !px-4 !py-2 text-sm disabled:opacity-60'
                    >
                        <Plus className='w-4 h-4' />
                    </button>
                    <button
                        title='cancel'
                        type='button'
                        onClick={() => {
                            setShowUrlInput(false)
                            setUrlInput('')
                        }}
                        className='p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors'
                    >
                        <X className='w-4 h-4' />
                    </button>
                </div>
            )}

            {/* Drag & drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                        ? 'border-green-400 bg-green-50'
                        : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
            >
                <Upload className='w-8 h-8 mx-auto mb-2 text-slate-300' />
                <p className='text-sm font-medium text-slate-500'>
                    Drag & drop images here, or <span className='text-green-600'>browse</span>
                </p>
                <p className='text-xs text-slate-400 mt-1'>PNG, JPG, WebP up to 5MB each</p>
            </div>

            {/* Image grid */}
            {images.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-8 text-slate-300'>
                    <ImageIcon className='w-10 h-10 mb-2' />
                    <p className='text-sm text-slate-400'>No images yet</p>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
                    {images.map((img) => (
                        <div key={img.id} className='relative group'>
                            {/* Image preview */}
                            <div
                                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                                    img.isPrimary
                                        ? 'border-green-500 ring-2 ring-green-200'
                                        : 'border-slate-200 hover:border-slate-400'
                                }`}
                            >
                                {img.url.startsWith('/uploads/') || img.url.startsWith('http') ? (
                                    <img
                                        src={img.url}
                                        alt={img.alt ?? 'Product image'}
                                        className='w-full h-full object-cover'
                                        onError={(e) => {
                                            ;(e.target as HTMLImageElement).src = ''
                                        }}
                                    />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center bg-slate-100 text-4xl'>
                                        🚴
                                    </div>
                                )}
                            </div>

                            {/* Primary badge */}
                            {img.isPrimary && (
                                <div className='absolute top-1.5 left-1.5 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1'>
                                    <Star className='w-2.5 h-2.5 fill-white' /> Primary
                                </div>
                            )}

                            {/* Action overlay */}
                            <div className='absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100'>
                                {!img.isPrimary && (
                                    <button
                                        type='button'
                                        onClick={() => handleSetPrimary(img.id)}
                                        disabled={settingPrimaryId === img.id}
                                        className='w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors'
                                        title='Set as primary'
                                    >
                                        {settingPrimaryId === img.id ? (
                                            <Loader2 className='w-3.5 h-3.5 text-slate-700 animate-spin' />
                                        ) : (
                                            <Star className='w-3.5 h-3.5 text-yellow-500' />
                                        )}
                                    </button>
                                )}
                                <button
                                    type='button'
                                    onClick={() => handleDelete(img.id)}
                                    disabled={deletingId === img.id}
                                    className='w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 flex items-center justify-center transition-colors'
                                    title='Remove image'
                                >
                                    {deletingId === img.id ? (
                                        <Loader2 className='w-3.5 h-3.5 text-white animate-spin' />
                                    ) : (
                                        <Trash2 className='w-3.5 h-3.5 text-white' />
                                    )}
                                </button>
                            </div>

                            {/* Alt text (truncated) */}
                            {img.alt && (
                                <p className='text-[10px] text-slate-400 truncate mt-1 px-1'>
                                    {img.alt}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <p className='text-xs text-slate-400'>
                ⭐ Click the star on any image to set it as the primary display image. The primary
                image appears in listings and at the top of the product page.
            </p>
        </div>
    )
}
