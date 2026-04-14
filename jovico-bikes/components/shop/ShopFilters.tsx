'use client'
import { cn } from '@/lib/utils'
import { Search, SlidersHorizontal } from 'lucide-react'
// components/shop/ShopFilters.tsx
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

const CATEGORIES = [
    { value: 'all', label: 'All Bikes' },
    { value: 'city_bike', label: 'City' },
    { value: 'mountain_bike', label: 'Mountain' },
    { value: 'cargo_bike', label: 'Cargo' },
    { value: 'folding_bike', label: 'Folding' },
    { value: 'road_bike', label: 'Road' },
]

export function ShopFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const currentCategory = (searchParams.get('category') ?? 'all').toLowerCase()
    const currentSort = searchParams.get('sort') ?? 'featured'
    const currentQuery = searchParams.get('q') ?? ''

    const navigate = useCallback(
        (params: Record<string, string>) => {
            const next = new URLSearchParams(searchParams.toString())
            for (const [k, v] of Object.entries(params)) {
                if (v) next.set(k, v)
                else next.delete(k)
            }
            startTransition(() => router.push(`/shop?${next.toString()}`))
        },
        [router, searchParams]
    )

    return (
        <section className='sticky top-[72px] z-30 bg-white border-b border-slate-100 shadow-sm'>
            <div className='jv-container py-3'>
                <div className='flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between'>
                    {/* Category tabs — horizontally scrollable */}
                    <div className='flex gap-2 overflow-x-auto pb-0.5 max-w-full scrollbar-none'>
                        {CATEGORIES.map((cat) => {
                            const isActive = currentCategory === cat.value
                            return (
                                <button
                                    key={cat.value}
                                    type='button'
                                    onClick={() =>
                                        navigate({
                                            category: cat.value === 'all' ? '' : cat.value,
                                            sort: currentSort,
                                        })
                                    }
                                    className={cn(
                                        'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0',
                                        isActive
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    )}
                                >
                                    {cat.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* Sort + Search */}
                    <div className='flex items-center gap-2 shrink-0 w-full sm:w-auto'>
                        {/* Search */}
                        <div className='relative flex-1 sm:flex-none'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none' />
                            <input
                                type='search'
                                defaultValue={currentQuery}
                                placeholder='Search bikes...'
                                className='w-full sm:w-40 focus:w-full sm:focus:w-52 pl-9 pr-4 py-2 rounded-full text-sm border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all'
                                onChange={(e) => {
                                    const q = e.target.value
                                    // debounce with a small timeout
                                    const id = setTimeout(
                                        () =>
                                            navigate({
                                                q,
                                                category:
                                                    currentCategory === 'all'
                                                        ? ''
                                                        : currentCategory,
                                            }),
                                        400
                                    )
                                    return () => clearTimeout(id)
                                }}
                            />
                        </div>

                        {/* Sort */}
                        <div className='relative shrink-0'>
                            <SlidersHorizontal className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none' />
                            <select
                                value={currentSort}
                                onChange={(e) => navigate({ sort: e.target.value })}
                                className='appearance-none pl-8 pr-8 py-2 rounded-full text-sm border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer'
                            >
                                <option value='featured'>Featured</option>
                                <option value='newest'>Newest</option>
                                <option value='price-asc'>Price ↑</option>
                                <option value='price-desc'>Price ↓</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
