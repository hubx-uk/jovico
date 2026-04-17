// app/(main)/account/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCustomerSession } from '@/lib/customerAuth'
import { prisma } from '@/lib/prisma'
import { formatNaira, formatDate } from '@/lib/utils'
import { ArrowRight, ShoppingBag, Package, Clock } from 'lucide-react'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'My Account' }

export default async function AccountDashboardPage() {
    const session = await getCustomerSession()
    if (!session) redirect('/account/login')

    const recentOrders = await prisma.order.findMany({
        where: { customerId: session.id },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { items: { take: 1 } },
    })

    const orderStats = await prisma.order.groupBy({
        by: ['status'],
        where: { customerId: session.id },
        _count: { id: true },
    })

    const statsMap = Object.fromEntries(orderStats.map((s) => [s.status, s._count.id]))
    const totalOrders = Object.values(statsMap).reduce((a, b) => a + b, 0)

    const statusColors: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    }

    return (
        <div className='space-y-6'>
            {/* Welcome */}
            <div>
                <h1 className='text-2xl font-extrabold text-slate-900'>
                    Welcome back, {session.name.split(' ')[0]}!
                </h1>
                <p className='text-slate-500 text-sm mt-1'>
                    Here's a summary of your Jovico Bikes account.
                </p>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <div className='w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3'>
                        <ShoppingBag className='w-5 h-5 text-amber-600' />
                    </div>
                    <div className='text-2xl font-extrabold text-slate-900'>{totalOrders}</div>
                    <div className='text-xs text-slate-500 mt-0.5'>Total Orders</div>
                </div>
                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <div className='w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-3'>
                        <Package className='w-5 h-5 text-green-600' />
                    </div>
                    <div className='text-2xl font-extrabold text-slate-900'>
                        {statsMap['DELIVERED'] ?? 0}
                    </div>
                    <div className='text-xs text-slate-500 mt-0.5'>Delivered</div>
                </div>
                <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                    <div className='w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3'>
                        <Clock className='w-5 h-5 text-blue-600' />
                    </div>
                    <div className='text-2xl font-extrabold text-slate-900'>
                        {(statsMap['PENDING'] ?? 0) + (statsMap['PROCESSING'] ?? 0)}
                    </div>
                    <div className='text-xs text-slate-500 mt-0.5'>In Progress</div>
                </div>
            </div>

            {/* Recent orders */}
            <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                <div className='flex items-center justify-between px-5 py-4 border-b border-slate-100'>
                    <h2 className='font-bold text-slate-900 text-sm'>Recent Orders</h2>
                    <Link
                        href='/account/orders'
                        className='text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1'
                    >
                        View all <ArrowRight className='w-3.5 h-3.5' />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className='py-12 text-center'>
                        <ShoppingBag className='w-10 h-10 mx-auto mb-3 text-slate-200' />
                        <p className='text-slate-500 text-sm'>No orders yet.</p>
                        <Link
                            href='/shop'
                            className='jv-btn-primary mt-4 inline-flex text-sm !py-2.5 !px-6'
                        >
                            Browse eBikes
                        </Link>
                    </div>
                ) : (
                    <div className='divide-y divide-slate-50'>
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                className='flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group'
                            >
                                <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0'>
                                    🚴
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='font-semibold text-slate-900 text-sm font-mono'>
                                        {order.orderNumber}
                                    </div>
                                    <div className='text-xs text-slate-400'>
                                        {formatDate(order.createdAt)}
                                    </div>
                                </div>
                                <div className='text-right shrink-0'>
                                    <div className='font-bold text-slate-900 text-sm'>
                                        {formatNaira(Number(order.total))}
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] ?? 'bg-slate-100 text-slate-600'}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <ArrowRight className='w-4 h-4 text-slate-300 group-hover:text-green-500 transition-colors shrink-0' />
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick actions */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Link
                    href='/shop'
                    className='flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm transition-all group'
                >
                    <div className='w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-green-500 transition-colors'>
                        <ShoppingBag className='w-5 h-5 text-white' />
                    </div>
                    <div>
                        <div className='font-bold text-slate-900 text-sm'>Shop eBikes</div>
                        <div className='text-xs text-slate-400'>Browse our full range</div>
                    </div>
                    <ArrowRight className='w-4 h-4 text-slate-300 ml-auto' />
                </Link>
                <Link
                    href='/account/profile'
                    className='flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm transition-all group'
                >
                    <div className='w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center'>
                        <span className='text-white font-bold text-sm'>
                            {session.name.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <div className='font-bold text-slate-900 text-sm'>Edit Profile</div>
                        <div className='text-xs text-slate-400'>Update your details</div>
                    </div>
                    <ArrowRight className='w-4 h-4 text-slate-300 ml-auto' />
                </Link>
            </div>
        </div>
    )
}
