'use client'
import { useSiteSettings } from '@/components/layout/SiteSettingsProvider'
import { formatNaira } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Link from 'next/link'
// app/(main)/cart/page.tsx
import { useEffect, useState } from 'react'

interface CartItem {
    id: string
    name: string
    price: number
    slug: string
    quantity: number
}

export default function CartPage() {
    const s = useSiteSettings()
    const [cart, setCart] = useState<CartItem[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const stored = localStorage.getItem('jovico_cart')
        if (stored) setCart(JSON.parse(stored))

        const handleUpdate = () => {
            const updated = localStorage.getItem('jovico_cart')
            setCart(updated ? JSON.parse(updated) : [])
        }
        window.addEventListener('cart-updated', handleUpdate)
        return () => window.removeEventListener('cart-updated', handleUpdate)
    }, [])

    function updateQty(id: string, delta: number) {
        const updated = cart
            .map((item) =>
                item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
            )
            .filter((item) => item.quantity > 0)
        setCart(updated)
        localStorage.setItem('jovico_cart', JSON.stringify(updated))
        window.dispatchEvent(new Event('cart-updated'))
    }

    function removeItem(id: string) {
        const updated = cart.filter((item) => item.id !== id)
        setCart(updated)
        localStorage.setItem('jovico_cart', JSON.stringify(updated))
        window.dispatchEvent(new Event('cart-updated'))
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal > 0 && subtotal < 100000 ? 5000 : 0
    const total = subtotal + shipping

    const waNumber = s.whatsapp.replace(/\D/g, '')
    const waUrl = `https://wa.me/${waNumber}`

    if (!mounted) {
        return (
            <div className='pt-32 pb-20 jv-container'>
                <div className='animate-pulse space-y-4'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='h-24 bg-slate-100 rounded-2xl' />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Header */}
            <section className='pt-32 pb-10 bg-slate-950'>
                <div className='jv-container'>
                    <h1 className='text-4xl md:text-5xl font-extrabold text-white mb-2'>
                        Your Cart
                    </h1>
                    <p className='text-slate-400'>
                        {cart.length === 0
                            ? 'Your cart is empty'
                            : `${cart.reduce((s, i) => s + i.quantity, 0)} item${cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''} ready for checkout`}
                    </p>
                </div>
            </section>

            <section className='jv-section bg-slate-50'>
                <div className='jv-container'>
                    {cart.length === 0 ? (
                        <div className='jv-card p-12 text-center max-w-md mx-auto'>
                            <ShoppingBag className='w-12 h-12 mx-auto mb-4 text-slate-300' />
                            <h2 className='text-xl font-bold text-slate-900 mb-2'>
                                Your cart is empty
                            </h2>
                            <p className='text-slate-500 mb-6'>
                                Browse our collection and add some eBikes or accessories.
                            </p>
                            <Link href='/shop' className='jv-btn-primary'>
                                <ArrowLeft className='w-4 h-4' /> Browse Shop
                            </Link>
                        </div>
                    ) : (
                        <div className='grid lg:grid-cols-[1fr_340px] gap-8'>
                            {/* Items */}
                            <div className='space-y-3'>
                                <div className='flex items-center justify-between mb-2'>
                                    <h2 className='font-bold text-slate-900'>
                                        Items ({cart.length})
                                    </h2>
                                    <Link
                                        href='/shop'
                                        className='text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1'
                                    >
                                        <ArrowLeft className='w-3.5 h-3.5' /> Continue Shopping
                                    </Link>
                                </div>
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className='jv-card p-5 flex items-center gap-4'
                                    >
                                        {/* Image placeholder */}
                                        <Link href={`/shop/${item.slug}`}>
                                            <div className='w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shrink-0 hover:scale-105 transition-transform'>
                                                🚴
                                            </div>
                                        </Link>

                                        {/* Info */}
                                        <div className='flex-1 min-w-0'>
                                            <Link
                                                href={`/shop/${item.slug}`}
                                                className='font-bold text-slate-900 hover:text-green-600 transition-colors line-clamp-1'
                                            >
                                                {item.name}
                                            </Link>
                                            <p className='text-sm text-slate-500 mt-0.5'>
                                                Unit price: {formatNaira(item.price)}
                                            </p>
                                        </div>

                                        {/* Qty controls */}
                                        <div className='flex items-center gap-2 shrink-0'>
                                            <button
                                                type='button'
                                                onClick={() => updateQty(item.id, -1)}
                                                className='w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors'
                                            >
                                                <Minus className='w-3.5 h-3.5 text-slate-700' />
                                            </button>
                                            <span className='w-8 text-center font-bold text-slate-900'>
                                                {item.quantity}
                                            </span>
                                            <button
                                                type='button'
                                                onClick={() => updateQty(item.id, 1)}
                                                className='w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors'
                                            >
                                                <Plus className='w-3.5 h-3.5 text-slate-700' />
                                            </button>
                                        </div>

                                        {/* Line total */}
                                        <div className='text-right shrink-0 w-28'>
                                            <div className='font-extrabold text-slate-900'>
                                                {formatNaira(item.price * item.quantity)}
                                            </div>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            type='button'
                                            onClick={() => removeItem(item.id)}
                                            className='p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0'
                                        >
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Order summary */}
                            <div>
                                <div className='jv-card p-6 sticky top-24'>
                                    <h3 className='font-bold text-slate-900 text-lg mb-5'>
                                        Order Summary
                                    </h3>
                                    <div className='space-y-3 mb-5'>
                                        <div className='flex justify-between text-sm text-slate-600'>
                                            <span>Subtotal</span>
                                            <span className='font-semibold text-slate-900'>
                                                {formatNaira(subtotal)}
                                            </span>
                                        </div>
                                        <div className='flex justify-between text-sm text-slate-600'>
                                            <span>Delivery</span>
                                            <span
                                                className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-slate-900'}`}
                                            >
                                                {shipping === 0 ? 'Free' : formatNaira(shipping)}
                                            </span>
                                        </div>
                                        {shipping > 0 && (
                                            <p className='text-xs text-slate-400'>
                                                Free delivery on orders over ₦100,000
                                            </p>
                                        )}
                                        <div className='pt-3 border-t border-slate-100 flex justify-between'>
                                            <span className='font-bold text-slate-900'>Total</span>
                                            <span className='font-extrabold text-xl text-slate-900'>
                                                {formatNaira(total)}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href='/checkout'
                                        className='jv-btn-primary w-full justify-center text-base !py-4 mb-3'
                                    >
                                        Proceed to Checkout <ArrowRight className='w-5 h-5' />
                                    </Link>

                                    <a
                                        href={`${waUrl}?text=Hi! I'd like to order: ${cart.map((i) => `${i.name} x${i.quantity}`).join(', ')}. Total: ${formatNaira(total)}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='jv-btn-secondary w-full justify-center text-sm !border-slate-200 !text-slate-700 hover:!bg-slate-50 mb-4'
                                    >
                                        Order via WhatsApp
                                    </a>

                                    <div className='flex items-center gap-2 text-xs text-slate-400 justify-center'>
                                        <span>🔒</span>
                                        <span>Secure checkout · No hidden fees</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
