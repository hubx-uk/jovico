// app/(main)/account/orders/[id]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react'
import { getCustomerSession } from '@/lib/customerAuth'
import { prisma } from '@/lib/prisma'
import { formatNaira, formatDate } from '@/lib/utils'
import { CancelOrderButton } from '@/components/account/CancelOrderButton'

export const metadata: Metadata = { title: 'Order Detail' }

export default async function CustomerOrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getCustomerSession()
    if (!session) redirect('/account/login')

    const { id } = await params
    const order = await prisma.order.findUnique({
        where: { id, customerId: session.id },
        include: {
            items: {
                include: { product: { select: { name: true, slug: true } } },
            },
        },
    })

    if (!order) notFound()

    const shipping = order.shippingAddress as { street?: string; city?: string; state?: string }

    const statusColors: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    }

    const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']
    const currentStep = steps.indexOf(order.status)

    return (
        <div className='space-y-6'>
            {/* Back + header */}
            <div>
                <Link
                    href='/account/orders'
                    className='inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm mb-3 transition-colors'
                >
                    <ArrowLeft className='w-3.5 h-3.5' /> Back to Orders
                </Link>
                <div className='flex flex-wrap items-start justify-between gap-3'>
                    <div>
                        <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900'>
                            Order{' '}
                            <span className='font-mono text-green-600'>{order.orderNumber}</span>
                        </h1>
                        <p className='text-slate-500 text-sm mt-0.5'>
                            {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <span
                        className={`jv-badge text-sm font-semibold ${statusColors[order.status]}`}
                    >
                        {order.status}
                    </span>
                </div>
            </div>

            {/* Progress tracker */}
            {order.status !== 'CANCELLED' && (
                <div className='bg-white rounded-2xl border border-slate-100 p-5 sm:p-6'>
                    <h2 className='font-bold text-slate-900 text-sm mb-5'>Order Progress</h2>
                    <div className='flex items-center gap-0'>
                        {steps.map((step, i) => {
                            const done = i <= currentStep
                            const active = i === currentStep
                            return (
                                <div key={step} className='flex-1 flex items-center'>
                                    <div className='flex flex-col items-center flex-1'>
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                                done
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'bg-white border-slate-200 text-slate-400'
                                            } ${active ? 'ring-4 ring-green-100' : ''}`}
                                        >
                                            {done ? '✓' : i + 1}
                                        </div>
                                        <span
                                            className={`text-[10px] mt-1.5 font-medium text-center leading-tight ${done ? 'text-slate-700' : 'text-slate-400'}`}
                                        >
                                            {step.charAt(0) + step.slice(1).toLowerCase()}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div
                                            className={`h-0.5 flex-1 mx-1 rounded-full transition-all ${i < currentStep ? 'bg-green-500' : 'bg-slate-200'}`}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className='grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5'>
                {/* Items */}
                <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                    <div className='px-5 py-4 border-b border-slate-100'>
                        <h2 className='font-bold text-slate-900 text-sm'>
                            Items ({order.items.length})
                        </h2>
                    </div>
                    <div className='divide-y divide-slate-50'>
                        {order.items.map((item) => (
                            <div key={item.id} className='flex items-center gap-4 px-5 py-4'>
                                <div className='w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0'>
                                    🚴
                                </div>
                                <div className='flex-1 min-w-0'>
                                    {item.product ? (
                                        <Link
                                            href={`/shop/${item.product.slug}`}
                                            className='font-semibold text-slate-900 text-sm hover:text-green-600 transition-colors'
                                        >
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <span className='font-semibold text-slate-900 text-sm'>
                                            {item.name}
                                        </span>
                                    )}
                                    <div className='text-xs text-slate-400 mt-0.5'>
                                        Qty: {item.quantity} × {formatNaira(Number(item.price))}
                                    </div>
                                </div>
                                <div className='font-bold text-slate-900 text-sm shrink-0'>
                                    {formatNaira(Number(item.price) * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Totals */}
                    <div className='px-5 py-4 border-t border-slate-100 bg-slate-50 space-y-2'>
                        {[
                            ['Subtotal', formatNaira(Number(order.subtotal))],
                            [
                                'Delivery',
                                Number(order.shipping) === 0
                                    ? 'Free'
                                    : formatNaira(Number(order.shipping)),
                            ],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className='flex justify-between text-sm text-slate-600'
                            >
                                <span>{label}</span>
                                <span className='font-medium'>{value}</span>
                            </div>
                        ))}
                        <div className='flex justify-between font-extrabold text-slate-900 text-base pt-2 border-t border-slate-200'>
                            <span>Total</span>
                            <span>{formatNaira(Number(order.total))}</span>
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className='space-y-4'>
                    {/* Shipping */}
                    <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                        <h2 className='font-bold text-slate-900 text-sm flex items-center gap-2 mb-3'>
                            <MapPin className='w-4 h-4 text-slate-500' /> Delivery Address
                        </h2>
                        <p className='text-sm text-slate-600'>{shipping.street}</p>
                        <p className='text-sm text-slate-600'>
                            {shipping.city}
                            {shipping.state ? `, ${shipping.state}` : ''}
                        </p>
                    </div>

                    {/* Payment status */}
                    <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                        <h2 className='font-bold text-slate-900 text-sm mb-3'>Payment</h2>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-slate-600'>Status</span>
                            <span
                                className={`jv-badge text-xs font-bold ${
                                    order.paymentStatus === 'PAID'
                                        ? 'bg-green-100 text-green-700'
                                        : order.paymentStatus === 'REFUNDED'
                                          ? 'bg-orange-100 text-orange-700'
                                          : 'bg-slate-100 text-slate-500'
                                }`}
                            >
                                {order.paymentStatus}
                            </span>
                        </div>
                        {order.paymentRef && (
                            <p className='text-xs text-slate-400 mt-2 font-mono'>
                                Ref: {order.paymentRef}
                            </p>
                        )}
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                            <h2 className='font-bold text-slate-900 text-sm mb-2'>Notes</h2>
                            <p className='text-sm text-slate-600 leading-relaxed'>{order.notes}</p>
                        </div>
                    )}

                    {/* Cancel button */}
                    {order.status === 'PENDING' && <CancelOrderButton orderId={order.id} />}

                    {/* WhatsApp support */}
                    <a
                        href={`https://wa.me/2348012345678?text=Hi! I need help with order ${order.orderNumber}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors border border-green-100'
                    >
                        <Phone className='w-4 h-4' /> Get Help on WhatsApp
                    </a>
                </div>
            </div>
        </div>
    )
}
