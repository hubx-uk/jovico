// app/admin/orders/[id]/page.tsx
import { ArrowLeft, Package, User, MapPin, Phone, Mail, FileText } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

import { prisma } from '@/lib/prisma'
import { formatNaira, formatDate } from '@/lib/utils'
import { AdminOrderStatusSelect } from '@/components/admin/AdminOrderStatusSelect'
import { AdminPaymentStatusSelect } from '@/components/admin/AdminPaymentStatusSelect'

export const metadata: Metadata = { title: 'Order Detail' }

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: { select: { name: true, slug: true, sku: true } },
                },
            },
        },
    })

    if (!order) notFound()

    const shipping = order.shippingAddress as {
        street?: string
        city?: string
        state?: string
    }

    const statusColors: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    }

    const payColors: Record<string, string> = {
        UNPAID: 'bg-slate-100 text-slate-600',
        PAID: 'bg-green-100 text-green-700',
        REFUNDED: 'bg-orange-100 text-orange-700',
    }

    return (
        <div className='max-w-4xl mx-auto'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8'>
                <div>
                    <Link
                        href='/admin/orders'
                        className='inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm mb-2 transition-colors'
                    >
                        <ArrowLeft className='w-3.5 h-3.5' /> Back to Orders
                    </Link>
                    <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900'>
                        Order <span className='font-mono text-green-600'>{order.orderNumber}</span>
                    </h1>
                    <p className='text-slate-500 text-sm mt-0.5'>{formatDate(order.createdAt)}</p>
                </div>
                <div className='flex items-center gap-2 shrink-0'>
                    <span
                        className={`jv-badge text-xs font-semibold ${statusColors[order.status]}`}
                    >
                        {order.status}
                    </span>
                    <span
                        className={`jv-badge text-xs font-semibold ${payColors[order.paymentStatus]}`}
                    >
                        {order.paymentStatus}
                    </span>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5'>
                {/* Left column */}
                <div className='space-y-5'>
                    {/* Order items */}
                    <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                        <div className='px-5 py-4 border-b border-slate-100 flex items-center gap-2'>
                            <Package className='w-4 h-4 text-slate-500' />
                            <h2 className='font-bold text-slate-900 text-sm'>
                                Order Items ({order.items.length})
                            </h2>
                        </div>
                        <div className='divide-y divide-slate-50'>
                            {order.items.map((item) => (
                                <div key={item.id} className='flex items-center gap-4 p-5'>
                                    <div className='w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shrink-0'>
                                        🚴
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='font-semibold text-slate-900 text-sm truncate'>
                                            {item.name}
                                        </div>
                                        {item.product?.sku && (
                                            <div className='text-xs text-slate-400 font-mono'>
                                                SKU: {item.product.sku}
                                            </div>
                                        )}
                                    </div>
                                    <div className='text-right shrink-0'>
                                        <div className='text-sm text-slate-500'>
                                            {item.quantity} × {formatNaira(Number(item.price))}
                                        </div>
                                        <div className='font-bold text-slate-900'>
                                            {formatNaira(Number(item.price) * item.quantity)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Totals */}
                        <div className='px-5 py-4 border-t border-slate-100 bg-slate-50 space-y-2'>
                            <div className='flex justify-between text-sm text-slate-600'>
                                <span>Subtotal</span>
                                <span className='font-medium'>
                                    {formatNaira(Number(order.subtotal))}
                                </span>
                            </div>
                            <div className='flex justify-between text-sm text-slate-600'>
                                <span>Shipping</span>
                                <span className='font-medium'>
                                    {Number(order.shipping) === 0
                                        ? 'Free'
                                        : formatNaira(Number(order.shipping))}
                                </span>
                            </div>
                            <div className='flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-200'>
                                <span>Total</span>
                                <span>{formatNaira(Number(order.total))}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                            <h2 className='font-bold text-slate-900 text-sm flex items-center gap-2 mb-3'>
                                <FileText className='w-4 h-4 text-slate-500' /> Order Notes
                            </h2>
                            <p className='text-sm text-slate-600 leading-relaxed'>{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* Right column */}
                <div className='space-y-5'>
                    {/* Customer info */}
                    <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                        <h2 className='font-bold text-slate-900 text-sm flex items-center gap-2 mb-4'>
                            <User className='w-4 h-4 text-slate-500' /> Customer
                        </h2>
                        <div className='space-y-3'>
                            <div>
                                <div className='text-xs text-slate-400 uppercase tracking-wider mb-0.5'>
                                    Name
                                </div>
                                <div className='font-semibold text-slate-900 text-sm'>
                                    {order.customerName}
                                </div>
                            </div>
                            <a
                                href={`mailto:${order.customerEmail}`}
                                className='flex items-center gap-2 text-sm text-slate-600 hover:text-green-600 transition-colors'
                            >
                                <Mail className='w-3.5 h-3.5 shrink-0' />
                                {order.customerEmail}
                            </a>
                            <a
                                href={`tel:${order.customerPhone}`}
                                className='flex items-center gap-2 text-sm text-slate-600 hover:text-green-600 transition-colors'
                            >
                                <Phone className='w-3.5 h-3.5 shrink-0' />
                                {order.customerPhone}
                            </a>
                            <a
                                href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors mt-2'
                            >
                                WhatsApp Customer
                            </a>
                        </div>
                    </div>

                    {/* Shipping address */}
                    <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                        <h2 className='font-bold text-slate-900 text-sm flex items-center gap-2 mb-4'>
                            <MapPin className='w-4 h-4 text-slate-500' /> Shipping Address
                        </h2>
                        <div className='text-sm text-slate-600 leading-relaxed'>
                            <p>{shipping.street}</p>
                            <p>
                                {shipping.city}
                                {shipping.state ? `, ${shipping.state}` : ''}
                            </p>
                        </div>
                    </div>

                    {/* Status management */}
                    <div className='bg-white rounded-2xl border border-slate-100 p-5 space-y-4'>
                        <h2 className='font-bold text-slate-900 text-sm'>Update Status</h2>
                        <div>
                            <label className='block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2'>
                                Order Status
                            </label>
                            <AdminOrderStatusSelect id={order.id} status={order.status} fullWidth />
                        </div>
                        <div>
                            <label className='block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2'>
                                Payment Status
                            </label>
                            <AdminPaymentStatusSelect
                                id={order.id}
                                paymentStatus={order.paymentStatus}
                            />
                        </div>
                    </div>

                    {/* Payment ref */}
                    {order.paymentRef && (
                        <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                            <div className='text-xs text-slate-400 uppercase tracking-wider mb-1'>
                                Payment Reference
                            </div>
                            <div className='font-mono text-sm text-slate-900'>
                                {order.paymentRef}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
