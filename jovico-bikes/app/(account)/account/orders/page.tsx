import { AccountSidebar } from '@/components/account/AccountSidebar'
import { getCustomerSession } from '@/lib/customerAuth'
import { prisma } from '@/lib/prisma'
import { formatDate, formatNaira } from '@/lib/utils'
import type { ShippingAddress } from '@/types'
import { ChevronRight, MapPin, Package } from 'lucide-react'
// app/(account)/account/orders/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'My Orders' }

export const dynamic = 'force-dynamic' // always fresh

export default async function AccountOrdersPage() {
    const session = await getCustomerSession()
    if (!session) redirect('/account/login')

    const [customer, orders] = await Promise.all([
        prisma.customer.findUnique({
            where: { id: session.id, deletedAt: null },
            select: { name: true, email: true },
        }),
        prisma.order.findMany({
            where: { customerId: session.id },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: { product: { select: { name: true, slug: true } } },
                },
            },
        }),
    ])

    if (!customer) redirect('/account/login')

    const statusColor: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    }

    const payColor: Record<string, string> = {
        UNPAID: 'bg-slate-100 text-slate-600',
        PAID: 'bg-green-100 text-green-700',
        REFUNDED: 'bg-orange-100 text-orange-700',
    }

    return (
        <div className='jv-container py-10 md:py-14 pt-28 sm:pt-32'>
            <div className='grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-6'>
                <AccountSidebar name={customer.name} email={customer.email} />

                <div>
                    <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900 mb-6'>
                        My Orders
                    </h1>

                    {orders.length === 0 ? (
                        <div className='bg-white rounded-2xl border border-slate-100 py-20 text-center'>
                            <Package className='w-12 h-12 mx-auto mb-3 text-slate-200' />
                            <p className='font-semibold text-slate-600 mb-1'>No orders yet</p>
                            <p className='text-slate-400 text-sm mb-6'>
                                Your order history will appear here.
                            </p>
                            <Link href='/shop' className='jv-btn-primary'>
                                Browse eBikes
                            </Link>
                        </div>
                    ) : (
                        <div className='space-y-5'>
                            {orders.map((order) => {
                                const addr = order.shippingAddress as ShippingAddress
                                return (
                                    <div
                                        key={order.id}
                                        id={order.id}
                                        className='bg-white rounded-2xl border border-slate-100 overflow-hidden'
                                    >
                                        {/* Order header */}
                                        <div className='px-5 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center gap-3'>
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-mono text-xs font-bold text-slate-600'>
                                                    {order.orderNumber}
                                                </p>
                                                <p className='text-xs text-slate-400'>
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                            <div className='flex items-center gap-2 flex-wrap'>
                                                <span
                                                    className={`jv-badge text-xs font-semibold ${statusColor[order.status]}`}
                                                >
                                                    {order.status}
                                                </span>
                                                <span
                                                    className={`jv-badge text-xs font-semibold ${payColor[order.paymentStatus]}`}
                                                >
                                                    {order.paymentStatus}
                                                </span>
                                                <span className='font-extrabold text-slate-900 text-sm ml-1'>
                                                    {formatNaira(Number(order.total))}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className='divide-y divide-slate-50'>
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className='flex items-center gap-4 px-5 py-4'
                                                >
                                                    <div className='w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0'>
                                                        🚴
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <p className='font-semibold text-slate-900 text-sm truncate'>
                                                            {item.name}
                                                        </p>
                                                        <p className='text-xs text-slate-400'>
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className='font-bold text-slate-900 text-sm shrink-0'>
                                                        {formatNaira(
                                                            Number(item.price) * item.quantity
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className='px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3'>
                                            {addr && (
                                                <div className='flex items-center gap-1.5 text-xs text-slate-500'>
                                                    <MapPin className='w-3.5 h-3.5 shrink-0' />
                                                    {addr.street}, {addr.city}
                                                    {addr.state ? `, ${addr.state}` : ''}
                                                </div>
                                            )}
                                            <a
                                                href={`https://wa.me/2348012345678?text=Hi! I'd like to follow up on order ${order.orderNumber}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors'
                                            >
                                                Enquire on WhatsApp{' '}
                                                <ChevronRight className='w-3 h-3' />
                                            </a>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
