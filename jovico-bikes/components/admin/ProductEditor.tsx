'use client'
// components/admin/ProductEditor.tsx
import { Save, Loader2, Plus, Minus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import type { ProductEditorData, ProductFormState } from '@/types'
import type { ProductCategory, ProductType } from '@/prisma/generated/prisma/enums'

const CATEGORIES: ProductCategory[] = [
    'CITY_BIKE',
    'MOUNTAIN_BIKE',
    'CARGO_BIKE',
    'FOLDING_BIKE',
    'ROAD_BIKE',
    'ACCESSORY',
    'PART',
    'APPAREL',
]

const TYPES: ProductType[] = ['BIKE', 'ACCESSORY', 'PART', 'APPAREL']

const SPEC_KEYS = [
    'motor',
    'battery',
    'range',
    'topSpeed',
    'chargeTime',
    'weight',
    'frame',
    'brakes',
    'gears',
    'display',
    'suspension',
]

interface Props {
    product: ProductEditorData | null
    mode: 'create' | 'edit'
}

export function ProductEditor({ product, mode }: Props) {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState<ProductFormState>({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ? String(Number(product.price)) : '',
        salePrice: product?.salePrice ? String(Number(product.salePrice)) : '',
        sku: product?.sku ?? '',
        stock: product?.stock ?? 0,
        category: product?.category ?? 'CITY_BIKE',
        type: product?.type ?? 'BIKE',
        brand: product?.brand ?? 'Jovico',
        featured: product?.featured ?? false,
        published: product?.published ?? true,
    })
    const [specs, setSpecs] = useState<Record<string, string>>(
        (product?.specs as Record<string, string> | null) ?? {}
    )

    function updateSpec(key: string, value: string) {
        setSpecs((s) => ({ ...s, [key]: value }))
    }

    function removeSpec(key: string) {
        setSpecs((s) => {
            const next = { ...s }
            delete next[key]
            return next
        })
    }

    function addSpec() {
        const key = prompt('Spec name (e.g. suspension):')
        if (key?.trim()) setSpecs((s) => ({ ...s, [key.trim()]: '' }))
    }

    function setField<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function handleSave() {
        if (!form.name || !form.price || !form.sku) {
            toast.error('Name, price and SKU are required.')
            return
        }
        setSaving(true)
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                salePrice: form.salePrice ? Number(form.salePrice) : null,
                stock: Number(form.stock),
                specs: Object.keys(specs).length > 0 ? specs : undefined,
            }
            const url = mode === 'edit' ? `/api/products/${product!.id}` : '/api/products'
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
            toast.success(mode === 'create' ? 'Product created!' : 'Product updated!')
            router.push('/admin/shop')
            router.refresh()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 lg:gap-6'>
            {/* Main */}
            <div className='space-y-5'>
                {/* Basic info */}
                <div className='bg-white rounded-2xl border border-slate-100 p-6 space-y-4'>
                    <h2 className='font-bold text-slate-900'>Basic Information</h2>
                    <div>
                        <label
                            htmlFor='name'
                            className='block text-sm font-semibold text-slate-700 mb-1.5'
                        >
                            Product Name *
                        </label>
                        <input
                            id='name'
                            type='text'
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                            className='jv-input'
                            placeholder='Jovico City Cruiser Pro'
                        />
                    </div>
                    <div>
                        <label
                            htmlFor='description'
                            className='block text-sm font-semibold text-slate-700 mb-1.5'
                        >
                            Description *
                        </label>
                        <textarea
                            id='description'
                            value={form.description}
                            onChange={(e) => setField('description', e.target.value)}
                            rows={4}
                            className='jv-input resize-none'
                            placeholder='Describe the product...'
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label
                                htmlFor='sku'
                                className='block text-sm font-semibold text-slate-700 mb-1.5'
                            >
                                SKU *
                            </label>
                            <input
                                id='sku'
                                type='text'
                                value={form.sku}
                                onChange={(e) => setField('sku', e.target.value)}
                                className='jv-input font-mono'
                                placeholder='JVC-CC-PRO-001'
                            />
                        </div>
                        <div>
                            <label
                                htmlFor='brand'
                                className='block text-sm font-semibold text-slate-700 mb-1.5'
                            >
                                Brand
                            </label>
                            <input
                                type='text'
                                value={form.brand}
                                onChange={(e) => setField('brand', e.target.value)}
                                className='jv-input'
                                placeholder='Jovico'
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className='bg-white rounded-2xl border border-slate-100 p-6 space-y-4'>
                    <h2 className='font-bold text-slate-900'>Pricing & Stock</h2>
                    <div className='grid grid-cols-3 gap-4'>
                        <div>
                            <label
                                htmlFor='price'
                                className='block text-sm font-semibold text-slate-700 mb-1.5'
                            >
                                Price (₦) *
                            </label>
                            <input
                                id='price'
                                type='number'
                                value={form.price}
                                onChange={(e) => setField('price', e.target.value)}
                                className='jv-input'
                                placeholder='485000'
                                min={0}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor='salePrice'
                                className='block text-sm font-semibold text-slate-700 mb-1.5'
                            >
                                Sale Price (₦)
                            </label>
                            <input
                                id='salePrice'
                                type='number'
                                value={form.salePrice}
                                onChange={(e) => setField('salePrice', e.target.value)}
                                className='jv-input'
                                placeholder='Optional'
                                min={0}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor='stock'
                                className='block text-sm font-semibold text-slate-700 mb-1.5'
                            >
                                Stock
                            </label>
                            <input
                                id='stock'
                                type='number'
                                value={form.stock}
                                onChange={(e) => setField('stock', Number(e.target.value))}
                                className='jv-input'
                                min={0}
                            />
                        </div>
                    </div>
                </div>

                {/* Specs */}
                <div className='bg-white rounded-2xl border border-slate-100 p-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='font-bold text-slate-900'>Technical Specs</h2>
                        <button
                            type='button'
                            onClick={addSpec}
                            className='flex items-center gap-1.5 text-sm text-green-600 font-semibold hover:text-green-700'
                        >
                            <Plus className='w-4 h-4' /> Add Spec
                        </button>
                    </div>
                    <div className='grid grid-cols-1 gap-3'>
                        {SPEC_KEYS.map((key) => (
                            <div key={key} className='flex items-center gap-3'>
                                <label
                                    htmlFor='motor'
                                    className='w-32 text-xs font-semibold text-slate-600 capitalize shrink-0'
                                >
                                    {key.replace(/([A-Z])/g, ' $1')}
                                </label>
                                <input
                                    id='motor'
                                    type='text'
                                    value={specs[key] ?? ''}
                                    onChange={(e) => updateSpec(key, e.target.value)}
                                    className='jv-input flex-1 text-sm'
                                    placeholder={key === 'motor' ? '500W Hub Motor' : '—'}
                                />
                            </div>
                        ))}
                        {Object.keys(specs)
                            .filter((k) => !SPEC_KEYS.includes(k))
                            .map((key) => (
                                <div key={key} className='flex items-center gap-3'>
                                    <label
                                        htmlFor={key}
                                        className='w-32 text-xs font-semibold text-slate-600 capitalize shrink-0'
                                    >
                                        {key}
                                    </label>
                                    <input
                                        id={key}
                                        type='text'
                                        value={specs[key]}
                                        onChange={(e) => updateSpec(key, e.target.value)}
                                        className='jv-input flex-1 text-sm'
                                    />
                                    <button
                                        title='remove spec'
                                        type='button'
                                        onClick={() => removeSpec(key)}
                                        className='p-2 text-red-400 hover:text-red-600 transition-colors'
                                    >
                                        <Minus className='w-3.5 h-3.5' />
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>

                <button
                    type='button'
                    onClick={handleSave}
                    disabled={saving}
                    className='jv-btn-primary w-full justify-center text-base !py-4'
                >
                    {saving ? (
                        <>
                            <Loader2 className='w-5 h-5 animate-spin' /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className='w-5 h-5' />{' '}
                            {mode === 'create' ? 'Create Product' : 'Save Changes'}
                        </>
                    )}
                </button>
            </div>

            {/* Sidebar */}
            <div className='space-y-5'>
                <div className='bg-white rounded-2xl border border-slate-100 p-5 space-y-4'>
                    <h3 className='font-bold text-slate-900 text-sm'>Settings</h3>
                    {(['published', 'featured'] as const).map((key) => (
                        <label key={key} className='flex items-center gap-3 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={form[key]}
                                onChange={(e) => setField(key, e.target.checked)}
                                className='w-4 h-4 rounded accent-green-500'
                            />
                            <span className='text-sm text-slate-700'>
                                {key === 'published'
                                    ? 'Published (visible on site)'
                                    : 'Featured product'}
                            </span>
                        </label>
                    ))}
                </div>

                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <h3 className='font-bold text-slate-900 text-sm mb-3'>Category</h3>
                    <select
                        title='product category'
                        value={form.category}
                        onChange={(e) => setField('category', e.target.value as ProductCategory)}
                        className='jv-input text-sm'
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <h3 className='font-bold text-slate-900 text-sm mb-3'>Type</h3>
                    <select
                        title='product type'
                        value={form.type}
                        onChange={(e) => setField('type', e.target.value as ProductType)}
                        className='jv-input text-sm'
                    >
                        {TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
