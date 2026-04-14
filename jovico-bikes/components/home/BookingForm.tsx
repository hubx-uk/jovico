'use client'
// components/home/BookingForm.tsx
import { useState } from 'react'
import { toast } from 'sonner'
import { Calendar, User, Mail, Phone, FileText, Loader2 } from 'lucide-react'

interface Service {
    id: string
    name: string
}

export function BookingForm({ services }: { services: Service[] }) {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
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
                <div className='text-5xl mb-4'>✅</div>
                <h3 className='text-2xl font-bold text-slate-900 mb-2'>Booking Received!</h3>
                <p className='text-slate-500'>
                    Our team will confirm your appointment via WhatsApp or email within 2 hours.
                </p>
            </div>
        )
    }

    return (
        <div className='jv-card p-8'>
            <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Full Name *
                        </label>
                        <div className='relative'>
                            <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                            <input
                                type='text'
                                name='name'
                                required
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
                                name='phone'
                                required
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
                            name='email'
                            required
                            placeholder='you@email.com'
                            className='jv-input pl-10'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Service Required *
                    </label>
                    <select name='serviceId' required className='jv-input appearance-none'>
                        <option value=''>Select a service...</option>
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
                            name='date'
                            required
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
                            name='notes'
                            rows={3}
                            placeholder='Tell us about your bike and any specific issues...'
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
                            <Loader2 className='w-5 h-5 animate-spin' /> Sending...
                        </>
                    ) : (
                        'Request Booking'
                    )}
                </button>
            </form>
        </div>
    )
}
