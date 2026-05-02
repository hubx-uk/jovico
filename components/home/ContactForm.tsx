'use client'
// components/home/ContactForm.tsx
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { User, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react'

interface CustomerProfile {
    name: string
    email: string
    phone: string | null
}

export function ContactForm() {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [customer, setCustomer] = useState<CustomerProfile | null>(null)
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
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
                // guest
            }
        }
        prefill()
    }, [])

    function set(key: keyof typeof form, value: string) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (!res.ok) throw new Error()
            setSent(true)
            toast.success("Message sent! We'll get back to you soon.")
        } catch {
            toast.error('Failed to send. Try WhatsApp instead.')
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className='jv-card p-10 text-center'>
                <div className='text-5xl mb-4'>🎉</div>
                <h3 className='text-2xl font-bold text-slate-900 mb-2'>Message Received!</h3>
                <p className='text-slate-500'>
                    We'll respond within 24 hours. Check WhatsApp for faster responses.
                </p>
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
                        Sending as{' '}
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
                                placeholder='Your name'
                                className='jv-input pl-10'
                            />
                        </div>
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Phone
                        </label>
                        <div className='relative'>
                            <Phone className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                            <input
                                type='tel'
                                value={form.phone}
                                onChange={(e) => set('phone', e.target.value)}
                                placeholder='+234…'
                                className='jv-input pl-10'
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Email *
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
                        Subject *
                    </label>
                    <select
                        required
                        value={form.subject}
                        onChange={(e) => set('subject', e.target.value)}
                        className='jv-input'
                    >
                        <option value=''>Select a topic…</option>
                        <option value='Product Enquiry'>Product Enquiry</option>
                        <option value='Service Booking'>Service Booking</option>
                        <option value='Order Status'>Order Status</option>
                        <option value='Partnership'>Partnership</option>
                        <option value='Other'>Other</option>
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Message *
                    </label>
                    <div className='relative'>
                        <MessageSquare className='absolute left-3.5 top-3.5 w-4 h-4 text-slate-400' />
                        <textarea
                            required
                            rows={5}
                            value={form.message}
                            onChange={(e) => set('message', e.target.value)}
                            placeholder='How can we help you?'
                            className='jv-input pl-10 resize-none'
                        />
                    </div>
                </div>
                <button
                    type='submit'
                    disabled={loading}
                    className='jv-btn-primary w-full justify-center text-base !py-4'
                >
                    {loading ? (
                        <>
                            <Loader2 className='w-5 h-5 animate-spin' /> Sending…
                        </>
                    ) : (
                        'Send Message'
                    )}
                </button>
            </form>
        </div>
    )
}
