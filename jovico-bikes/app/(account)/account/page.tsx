import { AccountSidebar } from '@/components/account/AccountSidebar'
import { getCustomerSession } from '@/lib/customerAuth'
import { prisma } from '@/lib/prisma'
import { formatDate, formatNaira } from '@/lib/utils'
import { ChevronRight, Package, ShoppingBag, User, Zap } from 'lucide-react'
// app/(account)/account/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'My Account' }

export const dynamic = 'force-dynamic' // always fresh

export default async function AccountDashboard() {
    const session = await getCustomerSession()
    if (!session) redirect('/account/login')

    const [customer, orders] = await Promise.all([
        prisma.customer.findUnique({
            where: { id: session.id, deletedAt: null },
            select: { name: true, email: true, createdAt: true, phone: true },
        }),
        prisma.order.findMany({
            where: { customerId: session.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { items: { take: 1, include: { product: { select: { name: true } } } } },
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

    return (
        <div className='jv-container py-10 md:py-14 pt-28 sm:pt-32'>
            <div className='grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-6'>
                <AccountSidebar name={customer.name} email={customer.email} />

                {/* Main content */}
                <div className='space-y-5'>
                    {/* Welcome card */}
                    <div className='bg-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden'>
                        <div className='absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2' />
                        <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-3'>
                                <div className='w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-bold text-xl'>
                                    {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className='text-slate-400 text-sm'>Welcome back</p>
                                    <h1 className='text-xl sm:text-2xl font-extrabold'>
                                        {customer.name}
                                    </h1>
                                </div>
                            </div>
                            <p className='text-slate-400 text-sm'>
                                Member since {formatDate(customer.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                        {[
                            {
                                label: 'Total Orders',
                                value: orders.length.toString(),
                                icon: Package,
                                color: 'bg-blue-50 text-blue-600',
                            },
                            {
                                label: 'Orders Delivered',
                                value: orders
                                    .filter((o) => o.status === 'DELIVERED')
                                    .length.toString(),
                                icon: ShoppingBag,
                                color: 'bg-green-50 text-green-600',
                            },
                            {
                                label: 'Pending',
                                value: orders
                                    .filter(
                                        (o) => o.status === 'PENDING' || o.status === 'PROCESSING'
                                    )
                                    .length.toString(),
                                icon: Zap,
                                color: 'bg-amber-50 text-amber-600',
                            },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className='bg-white rounded-2xl border border-slate-100 p-5'
                            >
                                <div
                                    className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}
                                >
                                    <stat.icon className='w-5 h-5' />
                                </div>
                                <div className='text-2xl font-extrabold text-slate-900'>
                                    {stat.value}
                                </div>
                                <div className='text-xs text-slate-500 mt-0.5'>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Recent orders */}
                    <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                        <div className='flex items-center justify-between px-5 py-4 border-b border-slate-100'>
                            <h2 className='font-bold text-slate-900'>Recent Orders</h2>
                            <Link
                                href='/account/orders'
                                className='text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1'
                            >
                                View all <ChevronRight className='w-3.5 h-3.5' />
                            </Link>
                        </div>
                        {orders.length === 0 ? (
                            <div className='py-12 text-center'>
                                <Package className='w-10 h-10 mx-auto mb-2 text-slate-200' />
                                <p className='text-slate-500 text-sm'>No orders yet</p>
                                <Link
                                    href='/shop'
                                    className='mt-4 jv-btn-primary !px-6 !py-2.5 text-sm inline-flex'
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className='divide-y divide-slate-50'>
                                {orders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/account/orders#${order.id}`}
                                        className='flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors'
                                    >
                                        <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0'>
                                            🚴
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-semibold text-slate-900 truncate'>
                                                {order.items[0]?.product?.name ?? 'Order'}
                                                {order.items.length > 1 &&
                                                    ` +${order.items.length - 1} more`}
                                            </p>
                                            <p className='text-xs text-slate-400 font-mono'>
                                                {order.orderNumber}
                                            </p>
                                        </div>
                                        <div className='text-right shrink-0'>
                                            <p className='text-sm font-bold text-slate-900'>
                                                {formatNaira(Number(order.total))}
                                            </p>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[order.status] ?? 'bg-slate-100 text-slate-600'}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick links */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <Link
                            href='/shop'
                            className='jv-card p-5 flex items-center gap-4 group hover:shadow-md'
                        >
                            <div className='w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0'>
                                <Zap className='w-5 h-5' />
                            </div>
                            <div>
                                <p className='font-semibold text-slate-900 text-sm group-hover:text-green-600 transition-colors'>
                                    Browse eBikes
                                </p>
                                <p className='text-xs text-slate-400'>Find your next ride</p>
                            </div>
                            <ChevronRight className='w-4 h-4 text-slate-300 ml-auto' />
                        </Link>
                        <Link
                            href='/services'
                            className='jv-card p-5 flex items-center gap-4 group hover:shadow-md'
                        >
                            <div className='w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0'>
                                <User className='w-5 h-5' />
                            </div>
                            <div>
                                <p className='font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors'>
                                    Book a Service
                                </p>
                                <p className='text-xs text-slate-400'>Expert eBike care</p>
                            </div>
                            <ChevronRight className='w-4 h-4 text-slate-300 ml-auto' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
