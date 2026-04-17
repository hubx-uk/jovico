'use client'
import { formatNaira } from '@/lib/utils'
import { ArrowLeft, CheckCircle2, Loader2, Mail, MapPin, Phone, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// app/(main)/checkout/page.tsx
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface CartItem {
    id: string
    name: string
    price: number
    slug: string
    quantity: number
}

export default function CheckoutPage() {
    const router = useRouter()
    const [cart, setCart] = useState<CartItem[]>([])
    const [mounted, setMounted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [form, setForm] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        street: '',
        city: '',
        state: 'Lagos',
        notes: '',
    })

    useEffect(() => {
        setMounted(true)
        const stored = localStorage.getItem('jovico_cart')
        if (stored) {
            const items = JSON.parse(stored)
            if (items.length === 0) router.push('/cart')
            setCart(items)
        } else {
            router.push('/cart')
        }
    }, [router])

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
    const shipping = subtotal > 0 && subtotal < 100000 ? 5000 : 0
    const total = subtotal + shipping

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
                    shippingAddress: { street: form.street, city: form.city, state: form.state },
                    items: cart.map((i) => ({
                        productId: i.id,
                        name: i.name,
                        price: i.price,
                        quantity: i.quantity,
                    })),
                    notes: form.notes,
                }),
            })
            if (!res.ok) throw new Error('Order failed')
            const order = await res.json()
            localStorage.removeItem('jovico_cart')
            window.dispatchEvent(new Event('cart-updated'))
            setSuccess(order.orderNumber)
        } catch {
            toast.error('Failed to place order. Please try WhatsApp.')
        } finally {
            setSubmitting(false)
        }
    }

    if (!mounted) return null

    if (success) {
        return (
            <div className='min-h-screen bg-slate-50 flex items-center justify-center p-6'>
                <div className='jv-card p-12 text-center max-w-md w-full'>
                    <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5'>
                        <CheckCircle2 className='w-9 h-9 text-green-600' />
                    </div>
                    <h1 className='text-2xl font-extrabold text-slate-900 mb-2'>Order Placed!</h1>
                    <p className='text-slate-500 mb-2'>
                        Thank you for your order. We'll contact you shortly to confirm.
                    </p>
                    <div className='bg-slate-50 rounded-2xl px-5 py-3 my-5 font-mono font-bold text-slate-900'>
                        {success}
                    </div>
                    <p className='text-sm text-slate-400 mb-6'>
                        A confirmation will be sent to your email and WhatsApp.
                    </p>
                    <Link href='/shop' className='jv-btn-primary w-full justify-center'>
                        Continue Shopping
                    </Link>
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
                                    <h2 className='font-bold text-slate-900 text-base sm:text-lg'>
                                        Contact Information
                                    </h2>
                                    <div>
                                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                            Full Name *
                                        </label>
                                        <div className='relative'>
                                            <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                                            <input
                                                type='text'
                                                required
                                                value={form.customerName}
                                                onChange={(e) =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        customerName: e.target.value,
                                                    }))
                                                }
                                                placeholder='Your full name'
                                                className='jv-input pl-10'
                                            />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                                Email *
                                            </label>
                                            <div className='relative'>
                                                <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                                                <input
                                                    type='email'
                                                    required
                                                    value={form.customerEmail}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            customerEmail: e.target.value,
                                                        }))
                                                    }
                                                    placeholder='you@email.com'
                                                    className='jv-input pl-10'
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                                Phone *
                                            </label>
                                            <div className='relative'>
                                                <Phone className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                                                <input
                                                    type='tel'
                                                    required
                                                    value={form.customerPhone}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            customerPhone: e.target.value,
                                                        }))
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
                                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                            Street Address *
                                        </label>
                                        <div className='relative'>
                                            <MapPin className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                                            <input
                                                type='text'
                                                required
                                                value={form.street}
                                                onChange={(e) =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        street: e.target.value,
                                                    }))
                                                }
                                                placeholder='14 Adeola Odeku, Victoria Island'
                                                className='jv-input pl-10'
                                            />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                                City *
                                            </label>
                                            <input
                                                type='text'
                                                required
                                                value={form.city}
                                                onChange={(e) =>
                                                    setForm((f) => ({ ...f, city: e.target.value }))
                                                }
                                                placeholder='Lagos'
                                                className='jv-input'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                                State *
                                            </label>
                                            <select
                                                value={form.state}
                                                onChange={(e) =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        state: e.target.value,
                                                    }))
                                                }
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
                                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                            Order Notes
                                        </label>
                                        <textarea
                                            value={form.notes}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, notes: e.target.value }))
                                            }
                                            rows={3}
                                            placeholder='Any special instructions...'
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
                                                Order...
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
