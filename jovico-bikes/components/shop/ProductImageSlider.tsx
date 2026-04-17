'use client'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
// components/shop/ProductImageSlider.tsx
import { useCallback, useEffect, useState } from 'react'

interface ProductImage {
    id: string
    url: string
    alt: string | null
    isPrimary: boolean
}

interface Props {
    images: ProductImage[]
    productName: string
}

export function ProductImageSlider({ images, productName }: Props) {
    // Sort: primary first
    const sorted = [...images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))

    const [current, setCurrent] = useState(0)
    const [lightbox, setLightbox] = useState(false)
    const [touchStart, setTouchStart] = useState<number | null>(null)

    const canPrev = current > 0
    const canNext = current < sorted.length - 1

    const prev = useCallback(() => {
        if (canPrev) setCurrent((c) => c - 1)
    }, [canPrev])

    const next = useCallback(() => {
        if (canNext) setCurrent((c) => c + 1)
    }, [canNext])

    // Keyboard navigation
    useEffect(() => {
        if (!lightbox) return
        function onKey(e: KeyboardEvent) {
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
            if (e.key === 'Escape') setLightbox(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [lightbox, prev, next])

    // Touch swipe
    function handleTouchStart(e: React.TouchEvent) {
        setTouchStart(e.touches[0].clientX)
    }
    function handleTouchEnd(e: React.TouchEvent) {
        if (touchStart === null) return
        const delta = touchStart - e.changedTouches[0].clientX
        if (delta > 50) next()
        if (delta < -50) prev()
        setTouchStart(null)
    }

    const currentImage = sorted[current]

    // Render a single image (handles real URLs and placeholder emoji)
    function renderImage(img: ProductImage, className?: string) {
        const isReal =
            img.url.startsWith('http') ||
            img.url.startsWith('/uploads/') ||
            img.url.startsWith('/images/')

        if (isReal) {
            return (
                <img
                    src={img.url}
                    alt={img.alt ?? productName}
                    className={cn('w-full h-full object-cover', className)}
                    draggable={false}
                />
            )
        }
        // Placeholder
        return (
            <div
                className={cn(
                    'w-full h-full flex items-center justify-center text-7xl sm:text-8xl select-none',
                    className
                )}
            >
                🚴
            </div>
        )
    }

    if (sorted.length === 0) {
        return (
            <div className='aspect-square rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-7xl sm:text-8xl'>
                🚴
            </div>
        )
    }

    return (
        <>
            {/* Main slider */}
            <div className='space-y-3'>
                {/* Main image */}
                <div
                    className='relative aspect-square rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden group cursor-pointer'
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => setLightbox(true)}
                    role='button'
                    aria-label='View fullscreen'
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setLightbox(true)}
                >
                    {/* Image */}
                    <div className='w-full h-full transition-all duration-500'>
                        {renderImage(currentImage)}
                    </div>

                    {/* Zoom hint */}
                    <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded-xl p-2'>
                        <ZoomIn className='w-4 h-4' />
                    </div>

                    {/* Prev/Next arrows — only if multiple images */}
                    {sorted.length > 1 && (
                        <>
                            <button
                                type='button'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    prev()
                                }}
                                disabled={!canPrev}
                                className={cn(
                                    'absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center transition-all hover:bg-white',
                                    canPrev ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                )}
                                aria-label='Previous image'
                            >
                                <ChevronLeft className='w-5 h-5 text-slate-700' />
                            </button>
                            <button
                                type='button'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    next()
                                }}
                                disabled={!canNext}
                                className={cn(
                                    'absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center transition-all hover:bg-white',
                                    canNext ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                )}
                                aria-label='Next image'
                            >
                                <ChevronRight className='w-5 h-5 text-slate-700' />
                            </button>
                        </>
                    )}

                    {/* Dot indicators */}
                    {sorted.length > 1 && (
                        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
                            {sorted.map((_, i) => (
                                <button
                                    key={_.id}
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setCurrent(i)
                                    }}
                                    aria-label={`Go to image ${i + 1}`}
                                    className={cn(
                                        'rounded-full transition-all',
                                        i === current
                                            ? 'w-5 h-2 bg-white'
                                            : 'w-2 h-2 bg-white/60 hover:bg-white/80'
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {sorted.length > 1 && (
                    <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-none'>
                        {sorted.map((img, i) => (
                            <button
                                key={img.id}
                                type='button'
                                onClick={() => setCurrent(i)}
                                aria-label={`View image ${i + 1}`}
                                className={cn(
                                    'shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all',
                                    i === current
                                        ? 'border-slate-900 opacity-100'
                                        : 'border-slate-200 opacity-60 hover:opacity-80 hover:border-slate-400'
                                )}
                            >
                                {renderImage(img, 'w-full h-full object-cover')}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'
                    onClick={() => setLightbox(false)}
                    role='dialog'
                    aria-modal='true'
                    aria-label='Image viewer'
                >
                    <div
                        className='relative max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden'
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className='aspect-square bg-slate-900 flex items-center justify-center'>
                            {renderImage(currentImage, 'object-contain')}
                        </div>

                        {/* Close */}
                        <button
                            type='button'
                            onClick={() => setLightbox(false)}
                            className='absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors'
                            aria-label='Close lightbox'
                        >
                            ✕
                        </button>

                        {/* Prev/Next in lightbox */}
                        {sorted.length > 1 && (
                            <>
                                <button
                                    type='button'
                                    onClick={prev}
                                    disabled={!canPrev}
                                    className={cn(
                                        'absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors',
                                        !canPrev && 'opacity-30 pointer-events-none'
                                    )}
                                >
                                    <ChevronLeft className='w-6 h-6' />
                                </button>
                                <button
                                    type='button'
                                    onClick={next}
                                    disabled={!canNext}
                                    className={cn(
                                        'absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors',
                                        !canNext && 'opacity-30 pointer-events-none'
                                    )}
                                >
                                    <ChevronRight className='w-6 h-6' />
                                </button>
                            </>
                        )}

                        {/* Counter */}
                        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full'>
                            {current + 1} / {sorted.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
