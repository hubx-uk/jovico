'use client'
import { Loader2, MapPin, Phone, Save, User } from 'lucide-react'
// components/account/ProfileForm.tsx
import { useState } from 'react'
import { toast } from 'sonner'

interface Customer {
    id: string
    name: string
    email: string
    phone: string | null
    address: string | null
}

export function ProfileForm({ customer }: { customer: Customer }) {
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        name: customer.name,
        phone: customer.phone ?? '',
        address: customer.address ?? '',
    })

    function set(key: keyof typeof form, value: string) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch('/api/customer/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (!res.ok) {
                const err: { error?: string } = await res.json()
                throw new Error(err.error ?? 'Update failed')
            }
            toast.success('Profile updated!')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to update')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className='bg-white rounded-2xl border border-slate-100 p-5 sm:p-6'>
            <h2 className='font-bold text-slate-900 mb-5'>Personal Information</h2>
            <form onSubmit={handleSave} className='space-y-4'>
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Full Name
                    </label>
                    <div className='relative'>
                        <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                        <input
                            type='text'
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            required
                            className='jv-input pl-10'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Email Address
                    </label>
                    <input
                        type='email'
                        value={customer.email}
                        disabled
                        className='jv-input opacity-60 cursor-not-allowed bg-slate-50'
                    />
                    <p className='text-xs text-slate-400 mt-1'>Email cannot be changed.</p>
                </div>

                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Phone Number
                    </label>
                    <div className='relative'>
                        <Phone className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                        <input
                            type='tel'
                            value={form.phone}
                            onChange={(e) => set('phone', e.target.value)}
                            placeholder='+234 801 234 5678'
                            className='jv-input pl-10'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Delivery Address
                    </label>
                    <div className='relative'>
                        <MapPin className='absolute left-3.5 top-3.5 w-4 h-4 text-slate-400' />
                        <textarea
                            value={form.address}
                            onChange={(e) => set('address', e.target.value)}
                            rows={3}
                            placeholder='14 Adeola Odeku, Victoria Island, Lagos'
                            className='jv-input pl-10 resize-none'
                        />
                    </div>
                </div>

                <button
                    type='submit'
                    disabled={saving}
                    className='jv-btn-primary w-full justify-center'
                >
                    {saving ? (
                        <>
                            <Loader2 className='w-4 h-4 animate-spin' /> Saving…
                        </>
                    ) : (
                        <>
                            <Save className='w-4 h-4' /> Save Changes
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
