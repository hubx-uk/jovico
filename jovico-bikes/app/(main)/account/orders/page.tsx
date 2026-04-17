// app/(main)/account/orders/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCustomerSession } from '@/lib/customerAuth'
import { prisma } from '@/lib/prisma'
import { formatNaira, formatDate } from '@/lib/utils'
import { ArrowRight, Package } from 'lucide-react'

export const metadata: Metadata = { title: 'My Orders' }

export default async function AccountOrdersPage() {
    const session = await getCustomerSession()
    if (!session) redirect('/account/login')

    const orders = await prisma.order.findMany({
        where: { customerId: session.id },
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: { select: { name: true } } } } },
    })

    const statusColors: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    }
    const payColors: Record<string, string> = {
        UNPAID: 'bg-slate-100 text-slate-500',
        PAID: 'bg-green-100 text-green-700',
        REFUNDED: 'bg-orange-100 text-orange-600',
    }

    return (
        <div className='space-y-5'>
            <h1 className='text-2xl font-extrabold text-slate-900'>My Orders</h1>

            {orders.length === 0 ? (
                <div className='bg-white rounded-2xl border border-slate-100 py-16 text-center'>
                    <Package className='w-12 h-12 mx-auto mb-3 text-slate-200' />
                    <p className='font-semibold text-slate-600'>No orders yet</p>
                    <p className='text-slate-400 text-sm mt-1 mb-5'>
                        Your orders will appear here once you shop.
                    </p>
                    <Link href='/shop' className='jv-btn-primary'>
                        Browse eBikes
                    </Link>
                </div>
            ) : (
                <div className='space-y-4'>
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/account/orders/${order.id}`}
                            className='block bg-white rounded-2xl border border-slate-100 hover:shadow-sm hover:border-slate-200 transition-all group overflow-hidden'
                        >
                            {/* Header */}
                            <div className='flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-50'>
                                <div>
                                    <span className='font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg mr-2'>
                                        {order.orderNumber}
                                    </span>
                                    <span className='text-xs text-slate-400'>
                                        {formatDate(order.createdAt)}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
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

                            {/* Items preview */}
                            <div className='px-5 py-4 flex items-center gap-4'>
                                <div className='flex -space-x-2'>
                                    {order.items.slice(0, 3).map((item, i) => (
                                        <div
                                            key={item.id}
                                            className='w-10 h-10 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center text-lg'
                                            style={{ zIndex: 10 - i }}
                                        >
                                            🚴
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className='w-10 h-10 rounded-xl bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600'>
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm text-slate-700 truncate'>
                                        {order.items.map((i) => i.name).join(', ')}
                                    </p>
                                    <p className='text-xs text-slate-400'>
                                        {order.items.length} item
                                        {order.items.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className='text-right shrink-0'>
                                    <div className='font-extrabold text-slate-900 text-base'>
                                        {formatNaira(Number(order.total))}
                                    </div>
                                    <div className='flex items-center gap-1 text-xs text-green-600 font-semibold group-hover:gap-2 transition-all mt-0.5'>
                                        View <ArrowRight className='w-3 h-3' />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
