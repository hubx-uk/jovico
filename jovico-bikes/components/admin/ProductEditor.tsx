'use client'
// components/admin/ProductEditor.tsx
import { Save, Loader2, Plus, Minus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const CATEGORIES = [
    'CITY_BIKE',
    'MOUNTAIN_BIKE',
    'CARGO_BIKE',
    'FOLDING_BIKE',
    'ROAD_BIKE',
    'ACCESSORY',
    'PART',
    'APPAREL',
]

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

interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: any
    salePrice: any
    sku: string
    stock: number
    category: string
    type: string
    brand: string | null
    specs: any
    featured: boolean
    published: boolean
}

interface Props {
    product: Product | null
    mode: 'create' | 'edit'
}

export function ProductEditor({ product, mode }: Props) {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ? String(product.price) : '',
        salePrice: product?.salePrice ? String(product.salePrice) : '',
        sku: product?.sku ?? '',
        stock: product?.stock ?? 0,
        category: product?.category ?? 'CITY_BIKE',
        type: product?.type ?? 'BIKE',
        brand: product?.brand ?? 'Jovico',
        featured: product?.featured ?? false,
        published: product?.published ?? true,
    })
    const [specs, setSpecs] = useState<Record<string, string>>(
        (product?.specs as Record<string, string>) ?? {}
    )

    function updateSpec(key: string, value: string) {
        setSpecs((s) => ({ ...s, [key]: value }))
    }
    function removeSpec(key: string) {
        setSpecs((s) => {
            const n = { ...s }
            delete n[key]
            return n
        })
    }
    function addSpec() {
        const key = prompt('Spec name (e.g. suspension):')
        if (key) setSpecs((s) => ({ ...s, [key]: '' }))
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
                const err = await res.json()
                throw new Error(err.error ?? 'Save failed')
            }
            toast.success(mode === 'create' ? 'Product created!' : 'Product updated!')
            router.push('/admin/shop')
            router.refresh()
        } catch (err: any) {
            toast.error(err.message ?? 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className='grid lg:grid-cols-[1fr_260px] gap-6'>
            {/* Main */}
            <div className='space-y-5'>
                {/* Basic info */}
                <div className='bg-white rounded-2xl border border-slate-100 p-6 space-y-4'>
                    <h2 className='font-bold text-slate-900'>Basic Information</h2>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Product Name *
                        </label>
                        <input
                            type='text'
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className='jv-input'
                            placeholder='Jovico City Cruiser Pro'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Description *
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, description: e.target.value }))
                            }
                            rows={4}
                            className='jv-input resize-none'
                            placeholder='Describe the product...'
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                SKU *
                            </label>
                            <input
                                type='text'
                                value={form.sku}
                                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                                className='jv-input font-mono'
                                placeholder='JVC-CC-PRO-001'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                Brand
                            </label>
                            <input
                                type='text'
                                value={form.brand}
                                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
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
                            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                Price (₦) *
                            </label>
                            <input
                                type='number'
                                value={form.price}
                                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                                className='jv-input'
                                placeholder='485000'
                                min={0}
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                Sale Price (₦)
                            </label>
                            <input
                                type='number'
                                value={form.salePrice}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, salePrice: e.target.value }))
                                }
                                className='jv-input'
                                placeholder='Optional'
                                min={0}
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                Stock
                            </label>
                            <input
                                type='number'
                                value={form.stock}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, stock: Number(e.target.value) }))
                                }
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
                                <label className='w-32 text-xs font-semibold text-slate-600 capitalize shrink-0'>
                                    {key.replace(/([A-Z])/g, ' $1')}
                                </label>
                                <input
                                    type='text'
                                    value={specs[key] ?? ''}
                                    onChange={(e) => updateSpec(key, e.target.value)}
                                    className='jv-input flex-1 text-sm'
                                    placeholder={`e.g. ${key === 'motor' ? '500W Hub Motor' : '...'}`}
                                />
                            </div>
                        ))}
                        {Object.keys(specs)
                            .filter((k) => !SPEC_KEYS.includes(k))
                            .map((key) => (
                                <div key={key} className='flex items-center gap-3'>
                                    <label className='w-32 text-xs font-semibold text-slate-600 capitalize shrink-0'>
                                        {key}
                                    </label>
                                    <input
                                        type='text'
                                        value={specs[key]}
                                        onChange={(e) => updateSpec(key, e.target.value)}
                                        className='jv-input flex-1 text-sm'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => removeSpec(key)}
                                        className='p-2 text-red-400 hover:text-red-600'
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
                    {[
                        { key: 'published', label: 'Published (visible on site)' },
                        { key: 'featured', label: 'Featured product' },
                    ].map(({ key, label }) => (
                        <label key={key} className='flex items-center gap-3 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={(form as any)[key]}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, [key]: e.target.checked }))
                                }
                                className='w-4 h-4 rounded accent-green-500'
                            />
                            <span className='text-sm text-slate-700'>{label}</span>
                        </label>
                    ))}
                </div>

                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <h3 className='font-bold text-slate-900 text-sm mb-3'>Category</h3>
                    <select
                        value={form.category}
                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
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
                        value={form.type}
                        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                        className='jv-input text-sm'
                    >
                        {['BIKE', 'ACCESSORY', 'PART', 'APPAREL'].map((t) => (
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
