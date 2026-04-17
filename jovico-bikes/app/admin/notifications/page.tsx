// app/admin/notifications/page.tsx
import { Bell, Package, Calendar, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { prisma } from '@/lib/prisma'
import { formatDate, formatNaira } from '@/lib/utils'

export const metadata: Metadata = { title: 'Notifications' }

export const dynamic = 'force-dynamic' // always fresh

export default async function AdminNotificationsPage() {
    const [newOrders, pendingBookings, unreadMessages] = await Promise.all([
        prisma.order.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                total: true,
                createdAt: true,
            },
        }),
        prisma.booking.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: { service: { select: { name: true } } },
        }),
        prisma.contactMessage.findMany({
            where: { read: false },
            orderBy: { createdAt: 'desc' },
            take: 20,
        }),
    ])

    type NotifItem = {
        type: 'order' | 'booking' | 'message'
        title: string
        desc: string
        time: Date
        color: string
        icon: React.ComponentType<{ className?: string }>
        href: string
    }

    const notifications: NotifItem[] = [
        ...newOrders.map((o) => ({
            type: 'order' as const,
            title: `New order from ${o.customerName}`,
            desc: `${o.orderNumber} · ${formatNaira(Number(o.total))}`,
            time: o.createdAt,
            color: 'bg-blue-100 text-blue-600',
            icon: Package,
            href: `/admin/orders/${o.id}`,
        })),
        ...pendingBookings.map((b) => ({
            type: 'booking' as const,
            title: `Service booking: ${b.service.name}`,
            desc: `${b.name} · ${formatDate(b.date)}`,
            time: b.createdAt,
            color: 'bg-yellow-100 text-yellow-700',
            icon: Calendar,
            href: '/admin/bookings',
        })),
        ...unreadMessages.map((m) => ({
            type: 'message' as const,
            title: `New enquiry: ${m.subject}`,
            desc: `From ${m.name} · ${m.email}`,
            time: m.createdAt,
            color: 'bg-green-100 text-green-700',
            icon: Mail,
            href: '/admin/enquiries',
        })),
    ].sort((a, b) => b.time.getTime() - a.time.getTime())

    const counts = {
        orders: newOrders.length,
        bookings: pendingBookings.length,
        messages: unreadMessages.length,
        total: newOrders.length + pendingBookings.length + unreadMessages.length,
    }

    return (
        <div className='max-w-3xl mx-auto'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8'>
                <div>
                    <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2'>
                        <Bell className='w-6 h-6 text-slate-600' />
                        Notifications
                    </h1>
                    <p className='text-slate-500 text-sm mt-0.5'>
                        {counts.total > 0
                            ? `${counts.total} item${counts.total !== 1 ? 's' : ''} need your attention`
                            : "You're all caught up!"}
                    </p>
                </div>
                {counts.total > 0 && (
                    <span className='jv-badge bg-red-100 text-red-600 text-xs font-bold self-start sm:self-center'>
                        {counts.total} new
                    </span>
                )}
            </div>

            {/* Summary cards */}
            {counts.total > 0 && (
                <div className='grid grid-cols-3 gap-3 mb-6'>
                    {[
                        {
                            label: 'Pending Orders',
                            count: counts.orders,
                            color: 'bg-blue-50 text-blue-600',
                            href: '/admin/orders',
                            icon: Package,
                        },
                        {
                            label: 'Unconfirmed Bookings',
                            count: counts.bookings,
                            color: 'bg-yellow-50 text-yellow-700',
                            href: '/admin/bookings',
                            icon: Calendar,
                        },
                        {
                            label: 'Unread Messages',
                            count: counts.messages,
                            color: 'bg-green-50 text-green-700',
                            href: '/admin/enquiries',
                            icon: Mail,
                        },
                    ].map((card) => (
                        <Link
                            key={card.label}
                            href={card.href}
                            className='bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-sm transition-all group text-center'
                        >
                            <div
                                className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mx-auto mb-2`}
                            >
                                <card.icon className='w-5 h-5' />
                            </div>
                            <div className='text-2xl font-extrabold text-slate-900'>
                                {card.count}
                            </div>
                            <div className='text-xs text-slate-500 leading-tight mt-0.5'>
                                {card.label}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Notification list */}
            <div className='space-y-3'>
                {notifications.length === 0 ? (
                    <div className='bg-white rounded-2xl border border-slate-100 py-20 text-center'>
                        <CheckCircle2 className='w-12 h-12 mx-auto mb-3 text-green-400' />
                        <p className='font-semibold text-slate-600'>Everything is handled!</p>
                        <p className='text-slate-400 text-sm mt-1'>
                            No pending orders, unconfirmed bookings, or unread messages.
                        </p>
                    </div>
                ) : (
                    notifications.map((n, i) => (
                        <Link
                            key={`${n.type}-${i}`}
                            href={n.href}
                            className='bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4 hover:shadow-sm hover:border-slate-200 transition-all group'
                        >
                            <div
                                className={`w-10 h-10 rounded-xl ${n.color} flex items-center justify-center shrink-0`}
                            >
                                <n.icon className='w-5 h-5' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <div className='font-semibold text-slate-900 text-sm group-hover:text-green-600 transition-colors'>
                                    {n.title}
                                </div>
                                <div className='text-xs text-slate-500 mt-0.5 truncate'>
                                    {n.desc}
                                </div>
                            </div>
                            <div className='flex flex-col items-end gap-1 shrink-0'>
                                <span className='text-xs text-slate-400 whitespace-nowrap'>
                                    {formatDate(n.time)}
                                </span>
                                <ArrowRight className='w-3.5 h-3.5 text-slate-300 group-hover:text-green-500 transition-colors' />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
