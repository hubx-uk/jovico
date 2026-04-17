'use client'
// components/admin/AdminCustomerEditForm.tsx
import { Save, Loader2, User, Phone, MapPin, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    customer: {
        id: string
        name: string
        phone: string | null
        address: string | null
    }
}

export function AdminCustomerEditForm({ customer }: Props) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
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
            const res = await fetch(`/api/admin/customers/${customer.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, phone: form.phone, address: form.address }),
            })
            if (!res.ok) {
                const err: { error?: string } = await res.json()
                throw new Error(err.error ?? 'Update failed')
            }
            toast.success('Customer profile updated.')
            router.refresh()
            setOpen(false)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
            <button
                type='button'
                onClick={() => setOpen((v) => !v)}
                className='flex items-center justify-between w-full px-5 py-4 text-left hover:bg-slate-50 transition-colors'
            >
                <h2 className='font-bold text-slate-900 text-sm'>Edit Profile</h2>
                <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div className='px-5 pb-5 border-t border-slate-100 pt-5'>
                    <form onSubmit={handleSave} className='space-y-4'>
                        <div>
                            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5'>
                                Full Name
                            </label>
                            <div className='relative'>
                                <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                                <input
                                    type='text'
                                    value={form.name}
                                    onChange={(e) => set('name', e.target.value)}
                                    required
                                    className='jv-input pl-10 text-sm'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5'>
                                Phone Number
                            </label>
                            <div className='relative'>
                                <Phone className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                                <input
                                    type='tel'
                                    value={form.phone}
                                    onChange={(e) => set('phone', e.target.value)}
                                    placeholder='+234 801 234 5678'
                                    className='jv-input pl-10 text-sm'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5'>
                                Delivery Address
                            </label>
                            <div className='relative'>
                                <MapPin className='absolute left-3.5 top-3.5 w-4 h-4 text-slate-400' />
                                <textarea
                                    value={form.address}
                                    onChange={(e) => set('address', e.target.value)}
                                    rows={2}
                                    placeholder='14 Adeola Odeku, Victoria Island'
                                    className='jv-input pl-10 resize-none text-sm'
                                />
                            </div>
                        </div>

                        <div className='flex gap-3 pt-1'>
                            <button
                                type='button'
                                onClick={() => setOpen(false)}
                                className='flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                type='submit'
                                disabled={saving}
                                className='flex-1 jv-btn-primary justify-center text-sm !py-2.5'
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className='w-4 h-4 animate-spin' /> Saving…
                                    </>
                                ) : (
                                    <>
                                        <Save className='w-4 h-4' /> Save
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
