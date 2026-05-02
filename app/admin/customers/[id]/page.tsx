// app/admin/customers/[id]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShoppingCart,
    Package,
    TrendingUp,
    ExternalLink,
} from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { formatNaira, formatDate } from '@/lib/utils'
import { AdminCustomerActions } from '@/components/admin/AdminCustomerActions'
import { AdminCustomerEditForm } from '@/components/admin/AdminCustomerEditForm'

export const metadata: Metadata = { title: 'Customer Detail' }

export default async function AdminCustomerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: { product: { select: { name: true, slug: true } } },
                    },
                },
            },
        },
    })

    if (!customer) notFound()

    // Aggregate stats
    const totalSpent = customer.orders
        .filter((o) => o.paymentStatus === 'PAID')
        .reduce((sum, o) => sum + Number(o.total), 0)
    const deliveredOrders = customer.orders.filter((o) => o.status === 'DELIVERED').length

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
        <div className='max-w-5xl mx-auto'>
            {/* ── Header ───────────────────────────────────────── */}
            <div className='mb-6 sm:mb-8'>
                <Link
                    href='/admin/customers'
                    className='inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm mb-3 transition-colors'
                >
                    <ArrowLeft className='w-3.5 h-3.5' /> Back to Customers
                </Link>
                <div className='flex flex-wrap items-start justify-between gap-4'>
                    <div className='flex items-center gap-4'>
                        <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white shrink-0 ${
                                customer.deletedAt ? 'bg-slate-400' : 'bg-amber-500'
                            }`}
                        >
                            {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2'>
                                {customer.name}
                                {customer.deletedAt && (
                                    <span className='jv-badge bg-red-100 text-red-600 text-xs font-semibold'>
                                        Soft Deleted
                                    </span>
                                )}
                            </h1>
                            <p className='text-slate-400 text-sm'>{customer.email}</p>
                        </div>
                    </div>
                    {/* Quick contact buttons */}
                    <div className='flex flex-wrap gap-2'>
                        <a
                            href={`mailto:${customer.email}`}
                            className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors'
                        >
                            <Mail className='w-3.5 h-3.5' /> Email
                        </a>
                        {customer.phone && (
                            <a
                                href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors'
                            >
                                <Phone className='w-3.5 h-3.5' /> WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Stat cards ───────────────────────────────────── */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6'>
                {[
                    {
                        icon: ShoppingCart,
                        label: 'Total Orders',
                        value: customer.orders.length,
                        color: 'bg-blue-100 text-blue-600',
                    },
                    {
                        icon: Package,
                        label: 'Delivered',
                        value: deliveredOrders,
                        color: 'bg-green-100 text-green-600',
                    },
                    {
                        icon: TrendingUp,
                        label: 'Total Spent',
                        value: formatNaira(totalSpent),
                        color: 'bg-amber-100 text-amber-600',
                    },
                    {
                        icon: Calendar,
                        label: 'Member Since',
                        value: new Intl.DateTimeFormat('en-NG', {
                            month: 'short',
                            year: 'numeric',
                        }).format(customer.createdAt),
                        color: 'bg-slate-100 text-slate-600',
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className='bg-white rounded-2xl border border-slate-100 p-4 sm:p-5'
                    >
                        <div
                            className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-2.5`}
                        >
                            <stat.icon className='w-4.5 h-4.5' style={{ width: 18, height: 18 }} />
                        </div>
                        <div className='text-base sm:text-xl font-extrabold text-slate-900 leading-tight tabular-nums'>
                            {stat.value}
                        </div>
                        <div className='text-xs text-slate-400 mt-0.5'>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5'>
                {/* ── Left: orders + edit ──────────────────────── */}
                <div className='space-y-5'>
                    {/* Edit form */}
                    <AdminCustomerEditForm
                        customer={{
                            id: customer.id,
                            name: customer.name,
                            phone: customer.phone,
                            address: customer.address,
                        }}
                    />

                    {/* Order history */}
                    <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                        <div className='px-5 py-4 border-b border-slate-100'>
                            <h2 className='font-bold text-slate-900 text-sm'>
                                Order History ({customer.orders.length})
                            </h2>
                        </div>
                        {customer.orders.length === 0 ? (
                            <div className='py-10 text-center text-slate-400'>
                                <ShoppingCart className='w-8 h-8 mx-auto mb-2 opacity-30' />
                                <p className='text-sm'>No orders yet</p>
                            </div>
                        ) : (
                            <div className='divide-y divide-slate-50'>
                                {customer.orders.map((order) => (
                                    <div key={order.id} className='px-5 py-4'>
                                        <div className='flex flex-wrap items-center justify-between gap-3 mb-2'>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg'>
                                                    {order.orderNumber}
                                                </span>
                                                <span className='text-xs text-slate-400'>
                                                    {formatDate(order.createdAt)}
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span
                                                    className={`jv-badge text-[10px] font-semibold ${statusColors[order.status]}`}
                                                >
                                                    {order.status}
                                                </span>
                                                <span
                                                    className={`jv-badge text-[10px] font-semibold ${payColors[order.paymentStatus]}`}
                                                >
                                                    {order.paymentStatus}
                                                </span>
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className='p-1.5 rounded-lg text-slate-300 hover:text-green-600 hover:bg-green-50 transition-colors'
                                                    title='View order'
                                                >
                                                    <ExternalLink className='w-3.5 h-3.5' />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <div className='text-xs text-slate-500 truncate flex-1'>
                                                {order.items.map((i) => i.name).join(', ')}
                                            </div>
                                            <span className='font-bold text-slate-900 text-sm shrink-0 ml-3'>
                                                {formatNaira(Number(order.total))}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right: profile info + actions ──────────── */}
                <div className='space-y-5'>
                    {/* Contact info card */}
                    <div className='bg-white rounded-2xl border border-slate-100 p-5'>
                        <h2 className='font-bold text-slate-900 text-sm mb-4'>
                            Contact Information
                        </h2>
                        <div className='space-y-3'>
                            <div className='flex items-start gap-2.5'>
                                <Mail className='w-4 h-4 text-slate-400 mt-0.5 shrink-0' />
                                <div>
                                    <div className='text-[10px] text-slate-400 uppercase tracking-wider mb-0.5'>
                                        Email
                                    </div>
                                    <a
                                        href={`mailto:${customer.email}`}
                                        className='text-sm text-slate-900 hover:text-green-600 transition-colors'
                                    >
                                        {customer.email}
                                    </a>
                                </div>
                            </div>
                            <div className='flex items-start gap-2.5'>
                                <Phone className='w-4 h-4 text-slate-400 mt-0.5 shrink-0' />
                                <div>
                                    <div className='text-[10px] text-slate-400 uppercase tracking-wider mb-0.5'>
                                        Phone
                                    </div>
                                    <span className='text-sm text-slate-900'>
                                        {customer.phone ?? 'Not provided'}
                                    </span>
                                </div>
                            </div>
                            <div className='flex items-start gap-2.5'>
                                <MapPin className='w-4 h-4 text-slate-400 mt-0.5 shrink-0' />
                                <div>
                                    <div className='text-[10px] text-slate-400 uppercase tracking-wider mb-0.5'>
                                        Address
                                    </div>
                                    <span className='text-sm text-slate-900 leading-relaxed'>
                                        {customer.address ?? 'Not provided'}
                                    </span>
                                </div>
                            </div>
                            <div className='flex items-start gap-2.5'>
                                <Calendar className='w-4 h-4 text-slate-400 mt-0.5 shrink-0' />
                                <div>
                                    <div className='text-[10px] text-slate-400 uppercase tracking-wider mb-0.5'>
                                        Joined
                                    </div>
                                    <span className='text-sm text-slate-900'>
                                        {formatDate(customer.createdAt)}
                                    </span>
                                </div>
                            </div>
                            {customer.deletedAt && (
                                <div className='flex items-start gap-2.5'>
                                    <div className='w-4 h-4 mt-0.5 shrink-0 text-red-400'>✕</div>
                                    <div>
                                        <div className='text-[10px] text-slate-400 uppercase tracking-wider mb-0.5'>
                                            Deleted
                                        </div>
                                        <span className='text-sm text-red-600'>
                                            {formatDate(customer.deletedAt)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <AdminCustomerActions
                        customerId={customer.id}
                        customerName={customer.name}
                        isDeleted={!!customer.deletedAt}
                    />
                </div>
            </div>
        </div>
    )
}
