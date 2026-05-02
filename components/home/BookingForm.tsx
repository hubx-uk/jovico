'use client'
// components/home/BookingForm.tsx
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Calendar, User, Mail, Phone, FileText, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface Service {
    id: string
    name: string
}

interface CustomerProfile {
    name: string
    email: string
    phone: string | null
}

export function BookingForm({ services }: { services: Service[] }) {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [customer, setCustomer] = useState<CustomerProfile | null>(null)
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        serviceId: '',
        date: '',
        notes: '',
    })

    // Prefill from logged-in customer
    useEffect(() => {
        async function prefill() {
            try {
                const res = await fetch('/api/customer/profile')
                if (!res.ok) return
                const profile: CustomerProfile = await res.json()
                setCustomer(profile)
                setForm((f) => ({
                    ...f,
                    name: profile.name || f.name,
                    email: profile.email || f.email,
                    phone: profile.phone || f.phone,
                }))
            } catch {
                // guest — leave blank
            }
        }
        prefill()
    }, [])

    function set(key: keyof typeof form, value: string) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (!res.ok) throw new Error('Booking failed')
            setSent(true)
            toast.success("Booking request sent! We'll confirm shortly.")
        } catch {
            toast.error('Something went wrong. Please try WhatsApp instead.')
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className='jv-card p-10 text-center'>
                <CheckCircle2 className='w-12 h-12 text-green-500 mx-auto mb-4' />
                <h3 className='text-2xl font-bold text-slate-900 mb-2'>Booking Received!</h3>
                <p className='text-slate-500 mb-5'>
                    Our team will confirm your appointment via WhatsApp or email within 2 hours.
                </p>
                {customer && (
                    <Link
                        href='/account/orders'
                        className='text-green-600 font-semibold text-sm hover:underline'
                    >
                        View your account →
                    </Link>
                )}
            </div>
        )
    }

    return (
        <div className='jv-card p-5 sm:p-8'>
            {customer && (
                <div className='flex items-center gap-2 mb-5 px-1'>
                    <div className='w-5 h-5 rounded-full bg-green-500 flex items-center justify-center'>
                        <span className='text-white text-[10px] font-bold'>
                            {customer.name.charAt(0)}
                        </span>
                    </div>
                    <p className='text-sm text-slate-600'>
                        Booking as{' '}
                        <span className='font-semibold text-slate-900'>{customer.name}</span>
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5'>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Full Name *
                        </label>
                        <div className='relative'>
                            <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                            <input
                                type='text'
                                required
                                value={form.name}
                                onChange={(e) => set('name', e.target.value)}
                                placeholder='Emeka Okafor'
                                className='jv-input pl-10'
                            />
                        </div>
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Phone Number *
                        </label>
                        <div className='relative'>
                            <Phone className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                            <input
                                type='tel'
                                required
                                value={form.phone}
                                onChange={(e) => set('phone', e.target.value)}
                                placeholder='+234 801 234 5678'
                                className='jv-input pl-10'
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Email Address *
                    </label>
                    <div className='relative'>
                        <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                        <input
                            type='email'
                            required
                            value={form.email}
                            onChange={(e) => set('email', e.target.value)}
                            placeholder='you@email.com'
                            className={`jv-input pl-10 ${customer ? 'bg-slate-50' : ''}`}
                            readOnly={!!customer}
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Service Required *
                    </label>
                    <select
                        required
                        value={form.serviceId}
                        onChange={(e) => set('serviceId', e.target.value)}
                        className='jv-input appearance-none'
                    >
                        <option value=''>Select a service…</option>
                        {services.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Preferred Date *
                    </label>
                    <div className='relative'>
                        <Calendar className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                        <input
                            type='date'
                            required
                            value={form.date}
                            onChange={(e) => set('date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className='jv-input pl-10'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Additional Notes
                    </label>
                    <div className='relative'>
                        <FileText className='absolute left-3.5 top-3.5 w-4 h-4 text-slate-400' />
                        <textarea
                            value={form.notes}
                            onChange={(e) => set('notes', e.target.value)}
                            rows={3}
                            placeholder='Tell us about your bike and any specific issues…'
                            className='jv-input pl-10 resize-none'
                        />
                    </div>
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='jv-btn-primary w-full justify-center text-base !py-4 disabled:opacity-60'
                >
                    {loading ? (
                        <>
                            <Loader2 className='w-5 h-5 animate-spin' /> Sending…
                        </>
                    ) : (
                        'Request Booking'
                    )}
                </button>

                {!customer && (
                    <p className='text-center text-xs text-slate-400'>
                        <Link
                            href='/account/login'
                            className='text-green-600 hover:underline font-semibold'
                        >
                            Sign in
                        </Link>{' '}
                        to have your details filled in automatically.
                    </p>
                )}
            </form>
        </div>
    )
}
