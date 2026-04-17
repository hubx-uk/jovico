'use client'
import type { ServiceEditorData, ServiceFormState } from '@/types'
import { Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
// components/admin/ServiceEditor.tsx
import { useState } from 'react'
import { toast } from 'sonner'

const ICONS = ['wrench', 'settings', 'battery', 'circle', 'zap', 'shield', 'star', 'tool']

interface Props {
    service: ServiceEditorData | null
    mode: 'create' | 'edit'
}

export function ServiceEditor({ service, mode }: Props) {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState<ServiceFormState>({
        name: service?.name ?? '',
        shortDesc: service?.shortDesc ?? '',
        description: service?.description ?? '',
        price: service?.price ? String(Number(service.price)) : '',
        priceNote: service?.priceNote ?? '',
        duration: service?.duration ?? '',
        icon: service?.icon ?? 'wrench',
        featured: service?.featured ?? false,
        published: service?.published ?? true,
        order: service?.order ?? 0,
    })

    function setField<K extends keyof ServiceFormState>(key: K, value: ServiceFormState[K]) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function handleSave() {
        if (!form.name || !form.description) {
            toast.error('Name and description are required.')
            return
        }
        setSaving(true)
        try {
            const payload = {
                ...form,
                price: form.price ? Number(form.price) : null,
                order: Number(form.order),
            }
            const url = mode === 'edit' ? `/api/services/${service!.id}` : '/api/services'
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
            toast.success(mode === 'create' ? 'Service created!' : 'Service updated!')
            router.push('/admin/services')
            router.refresh()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className='space-y-5'>
            <div className='bg-white rounded-2xl border border-slate-100 p-6 space-y-5'>
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Service Name *
                    </label>
                    <input
                        type='text'
                        value={form.name}
                        onChange={(e) => setField('name', e.target.value)}
                        className='jv-input'
                        placeholder='e.g. Basic Tune-Up'
                    />
                </div>
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Short Description *
                    </label>
                    <input
                        type='text'
                        value={form.shortDesc}
                        onChange={(e) => setField('shortDesc', e.target.value)}
                        className='jv-input'
                        placeholder='One-line summary shown in listings'
                    />
                </div>
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Full Description *
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setField('description', e.target.value)}
                        rows={4}
                        className='jv-input resize-none'
                        placeholder='Detailed description of what is included...'
                    />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Price (₦)
                        </label>
                        <input
                            type='number'
                            value={form.price}
                            onChange={(e) => setField('price', e.target.value)}
                            className='jv-input'
                            placeholder='8500'
                            min={0}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Duration
                        </label>
                        <input
                            type='text'
                            value={form.duration}
                            onChange={(e) => setField('duration', e.target.value)}
                            className='jv-input'
                            placeholder='e.g. 2–3 hours'
                        />
                    </div>
                </div>
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Price Note
                    </label>
                    <input
                        type='text'
                        value={form.priceNote}
                        onChange={(e) => setField('priceNote', e.target.value)}
                        className='jv-input'
                        placeholder='e.g. Starting from. Quote given after diagnosis.'
                    />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Icon
                        </label>
                        <select
                            value={form.icon}
                            onChange={(e) => setField('icon', e.target.value)}
                            className='jv-input'
                        >
                            {ICONS.map((i) => (
                                <option key={i} value={i}>
                                    {i}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Display Order
                        </label>
                        <input
                            type='number'
                            value={form.order}
                            onChange={(e) => setField('order', Number(e.target.value))}
                            className='jv-input'
                            min={0}
                        />
                    </div>
                </div>
                <div className='flex gap-6'>
                    {(['published', 'featured'] as const).map((key) => (
                        <label key={key} className='flex items-center gap-2 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={form[key]}
                                onChange={(e) => setField(key, e.target.checked)}
                                className='w-4 h-4 rounded accent-green-500'
                            />
                            <span className='text-sm text-slate-700'>
                                {key === 'published' ? 'Visible on site' : 'Featured service'}
                            </span>
                        </label>
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
                        {mode === 'create' ? 'Create Service' : 'Save Changes'}
                    </>
                )}
            </button>
        </div>
    )
}
