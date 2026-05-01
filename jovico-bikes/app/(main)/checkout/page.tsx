'use client'
// app/(main)/checkout/page.tsx
import { ArrowLeft, CheckCircle2, Loader2, User, Mail, Phone, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

import type { CartItem } from '@/types'
import { formatNaira } from '@/lib/utils'

interface CustomerProfile {
    id: string
    name: string
    email: string
    phone: string | null
    address: string | null
}

interface FormState {
    customerName: string
    customerEmail: string
    customerPhone: string
    street: string
    city: string
    state: string
    notes: string
}

export default function CheckoutPage() {
    const router = useRouter()
    const [cart, setCart] = useState<CartItem[]>([])
    const [mounted, setMounted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [customer, setCustomer] = useState<CustomerProfile | null>(null)
    const [form, setForm] = useState<FormState>({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        street: '',
        city: '',
        state: 'Lagos',
        notes: '',
    })

    // Load cart from localStorage
    useEffect(() => {
        setMounted(true)
        const stored = localStorage.getItem('jovico_cart')
        if (stored) {
            const items = JSON.parse(stored) as CartItem[]
            if (items.length === 0) {
                router.push('/cart')
                return
            }
            setCart(items)
        } else {
            router.push('/cart')
        }
    }, [router])

    // Try to fetch logged-in customer profile and prefill form
    useEffect(() => {
        async function prefill() {
            try {
                const res = await fetch('/api/customer/profile')
                if (!res.ok) return // guest — no prefill
                const profile: CustomerProfile = await res.json()
                setCustomer(profile)

                // Parse saved address back into street/city/state if possible
                const savedAddr = profile.address ?? ''
                const parts = savedAddr.split(',').map((p) => p.trim())

                setForm((f) => ({
                    ...f,
                    customerName: profile.name || f.customerName,
                    customerEmail: profile.email || f.customerEmail,
                    customerPhone: profile.phone || f.customerPhone,
                    street: parts[0] || f.street,
                    city: parts[1] || f.city,
                    state: parts[2] || f.state,
                }))
            } catch {
                // Guest checkout — leave form empty
            }
        }
        prefill()
    }, [])

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
    const shipping = subtotal > 0 && subtotal < 100000 ? 5000 : 0
    const total = subtotal + shipping

    function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (cart.length === 0) return
        setSubmitting(true)
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: form.customerName,
                    customerEmail: form.customerEmail,
                    customerPhone: form.customerPhone,
                    shippingAddress: {
                        street: form.street,
                        city: form.city,
                        state: form.state,
                    },
                    items: cart.map((i) => ({
                        productId: i.id,
                        name: i.name,
                        price: i.price,
                        quantity: i.quantity,
                    })),
                    notes: form.notes,
                    // customerId is resolved server-side from the session cookie
                }),
            })
            if (!res.ok) throw new Error('Order failed')
            const order = await res.json()
            localStorage.removeItem('jovico_cart')
            window.dispatchEvent(new Event('cart-updated'))
            setSuccess(order.orderNumber)
        } catch {
            toast.error('Failed to place order. Please try WhatsApp instead.')
        } finally {
            setSubmitting(false)
        }
    }

    if (!mounted) return null

    if (success) {
        return (
            <div className='min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-28'>
                <div className='jv-card p-10 sm:p-12 text-center max-w-md w-full'>
                    <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5'>
                        <CheckCircle2 className='w-9 h-9 text-green-600' />
                    </div>
                    <h1 className='text-2xl font-extrabold text-slate-900 mb-2'>Order Placed!</h1>
                    <p className='text-slate-500 mb-2'>
                        Thank you! We&apos;ll contact you shortly to confirm.
                    </p>
                    <div className='bg-slate-50 rounded-2xl px-5 py-3 my-5 font-mono font-bold text-slate-900'>
                        {success}
                    </div>
                    <p className='text-sm text-slate-400 mb-6'>
                        A confirmation will be sent to your email and WhatsApp.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-3'>
                        {customer && (
                            <Link
                                href='/account/orders'
                                className='jv-btn-secondary flex-1 justify-center !border-slate-200 !text-slate-700'
                            >
                                View My Orders
                            </Link>
                        )}
                        <Link href='/shop' className='jv-btn-primary flex-1 justify-center'>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <section className='pt-28 sm:pt-32 pb-10 bg-slate-950'>
                <div className='jv-container'>
                    <Link
                        href='/cart'
                        className='inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm mb-5'
                    >
                        <ArrowLeft className='w-4 h-4' /> Back to Cart
                    </Link>
                    <h1 className='text-3xl sm:text-4xl font-extrabold text-white'>Checkout</h1>
                    {customer && (
                        <p className='text-slate-400 text-sm mt-1'>
                            Checking out as{' '}
                            <span className='text-green-400 font-semibold'>{customer.name}</span>
                        </p>
                    )}
                </div>
            </section>

            <section className='jv-section bg-slate-50'>
                <div className='jv-container'>
                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8'>
                            {/* Details */}
                            <div className='space-y-4 sm:space-y-5'>
                                {/* Contact */}
                                <div className='jv-card p-5 sm:p-6 space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <h2 className='font-bold text-slate-900 text-base sm:text-lg'>
                                            Contact Information
                                        </h2>
                                        {customer && (
                                            <span className='jv-badge bg-green-100 text-green-700 text-xs'>
                                                Pre-filled from your profile
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor='customerName'
                                            className='block text-sm font-semibold text-slate-700 mb-1.5'
                                        >
                                            Full Name *
                                        </label>
                                        <div className='relative'>
                                            <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                                            <input
                                                required
                                                type='text'
                                                id='customerName'
                                                value={form.customerName}
                                                onChange={(e) =>
                                                    setField('customerName', e.target.value)
                                                }
                                                placeholder='Your full name'
                                                className='jv-input pl-10'
                                            />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label
                                                htmlFor='customerEmail'
                                                className='block text-sm font-semibold text-slate-700 mb-1.5'
                                            >
                                                Email *
                                            </label>
                                            <div className='relative'>
                                                <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                                                <input
                                                    required
                                                    type='email'
                                                    id='customerEmail'
                                                    value={form.customerEmail}
                                                    onChange={(e) =>
                                                        setField('customerEmail', e.target.value)
                                                    }
                                                    placeholder='you@email.com'
                                                    className={`jv-input pl-10 ${customer ? 'bg-slate-50' : ''}`}
                                                    readOnly={!!customer}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor='customerPhone'
                                                className='block text-sm font-semibold text-slate-700 mb-1.5'
                                            >
                                                Phone *
                                            </label>
                                            <div className='relative'>
                                                <Phone className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                                                <input
                                                    required
                                                    type='tel'
                                                    id='customerPhone'
                                                    value={form.customerPhone}
                                                    onChange={(e) =>
                                                        setField('customerPhone', e.target.value)
                                                    }
                                                    placeholder='+234 801...'
                                                    className='jv-input pl-10'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery */}
                                <div className='jv-card p-5 sm:p-6 space-y-4'>
                                    <h2 className='font-bold text-slate-900 text-base sm:text-lg'>
                                        Delivery Address
                                    </h2>
                                    <div>
                                        <label
                                            htmlFor='street'
                                            className='block text-sm font-semibold text-slate-700 mb-1.5'
                                        >
                                            Street Address *
                                        </label>
                                        <div className='relative'>
                                            <MapPin className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                                            <input
                                                required
                                                id='street'
                                                type='text'
                                                value={form.street}
                                                onChange={(e) => setField('street', e.target.value)}
                                                placeholder='14 Adeola Odeku, Victoria Island'
                                                className='jv-input pl-10'
                                            />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label
                                                htmlFor='city'
                                                className='block text-sm font-semibold text-slate-700 mb-1.5'
                                            >
                                                City *
                                            </label>
                                            <input
                                                required
                                                id='city'
                                                type='text'
                                                value={form.city}
                                                onChange={(e) => setField('city', e.target.value)}
                                                placeholder='Lagos'
                                                className='jv-input'
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor='state'
                                                className='block text-sm font-semibold text-slate-700 mb-1.5'
                                            >
                                                State *
                                            </label>
                                            <select
                                                id='state'
                                                value={form.state}
                                                onChange={(e) => setField('state', e.target.value)}
                                                className='jv-input'
                                            >
                                                {[
                                                    'Lagos',
                                                    'Abuja',
                                                    'Rivers',
                                                    'Oyo',
                                                    'Kano',
                                                    'Enugu',
                                                    'Delta',
                                                    'Edo',
                                                    'Anambra',
                                                    'Ogun',
                                                ].map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor='notes'
                                            className='block text-sm font-semibold text-slate-700 mb-1.5'
                                        >
                                            Order Notes
                                        </label>
                                        <textarea
                                            id='notes'
                                            value={form.notes}
                                            onChange={(e) => setField('notes', e.target.value)}
                                            rows={3}
                                            placeholder='Any special instructions…'
                                            className='jv-input resize-none'
                                        />
                                    </div>
                                </div>

                                {/* Payment note */}
                                <div className='jv-card p-5 bg-green-50 border-green-100'>
                                    <p className='text-sm text-green-800 font-medium'>
                                        💳 Payment via Bank Transfer or POS on delivery. Our team
                                        will confirm your order and share payment details via
                                        WhatsApp within 2 hours.
                                    </p>
                                </div>

                                {!customer && (
                                    <div className='jv-card p-5 bg-amber-50 border-amber-200'>
                                        <p className='text-sm text-amber-800'>
                                            💡{' '}
                                            <Link
                                                href='/account/login'
                                                className='font-semibold underline'
                                            >
                                                Sign in
                                            </Link>{' '}
                                            to auto-fill your details and track this order in your
                                            account dashboard.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Order summary */}
                            <div>
                                <div className='jv-card p-6 sticky top-24'>
                                    <h3 className='font-bold text-slate-900 text-lg mb-5'>
                                        Order Summary
                                    </h3>
                                    <div className='space-y-3 mb-5'>
                                        {cart.map((item) => (
                                            <div
                                                key={item.id}
                                                className='flex justify-between text-sm'
                                            >
                                                <span className='text-slate-600 line-clamp-1 flex-1 pr-3'>
                                                    {item.name} × {item.quantity}
                                                </span>
                                                <span className='font-semibold text-slate-900 shrink-0'>
                                                    {formatNaira(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                        <div className='pt-3 border-t border-slate-100 space-y-2'>
                                            <div className='flex justify-between text-sm text-slate-600'>
                                                <span>Subtotal</span>
                                                <span className='font-semibold'>
                                                    {formatNaira(subtotal)}
                                                </span>
                                            </div>
                                            <div className='flex justify-between text-sm text-slate-600'>
                                                <span>Delivery</span>
                                                <span
                                                    className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}
                                                >
                                                    {shipping === 0
                                                        ? 'Free'
                                                        : formatNaira(shipping)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='pt-3 border-t border-slate-100 flex justify-between'>
                                            <span className='font-bold text-slate-900'>Total</span>
                                            <span className='font-extrabold text-xl text-slate-900'>
                                                {formatNaira(total)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type='submit'
                                        disabled={submitting}
                                        className='jv-btn-primary w-full justify-center text-base !py-4'
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className='w-5 h-5 animate-spin' /> Placing
                                                Order…
                                            </>
                                        ) : (
                                            <>Place Order · {formatNaira(total)}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}
