'use client'
import { Loader2, Mail, MessageSquare, Phone, User } from 'lucide-react'
// components/home/ContactForm.tsx
import { useState } from 'react'
import { toast } from 'sonner'

export function ContactForm() {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
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
                                name='phone'
                                placeholder='+234...'
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
                            name='email'
                            required
                            placeholder='you@email.com'
                            className='jv-input pl-10'
                        />
                    </div>
                </div>
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Subject *
                    </label>
                    <select name='subject' required className='jv-input'>
                        <option value=''>Select a topic...</option>
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
                            name='message'
                            required
                            rows={5}
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
                            <Loader2 className='w-5 h-5 animate-spin' /> Sending...
                        </>
                    ) : (
                        'Send Message'
                    )}
                </button>
            </form>
        </div>
    )
}
