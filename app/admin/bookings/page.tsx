// app/admin/bookings/page.tsx
import type { Metadata } from 'next'

import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { AdminBookingStatus } from '@/components/admin/AdminBookingStatus'

export const metadata: Metadata = { title: 'Bookings' }

export default async function AdminBookingsPage() {
    const bookings = await prisma.booking.findMany({
        orderBy: { date: 'asc' },
        include: { service: { select: { name: true } } },
    })

    const statusColors: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700',
        CONFIRMED: 'bg-blue-100 text-blue-700',
        COMPLETED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    }

    const pending = bookings.filter((b) => b.status === 'PENDING').length

    return (
        <div className='max-w-6xl mx-auto'>
            <div className='mb-8'>
                <h1 className='text-2xl font-extrabold text-slate-900'>Service Bookings</h1>
                <p className='text-slate-500 text-sm mt-0.5'>
                    {bookings.length} total · {pending} pending confirmation
                </p>
            </div>

            {/* Summary cards */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
                {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => {
                    const count = bookings.filter((b) => b.status === status).length
                    return (
                        <div
                            key={status}
                            className='bg-white rounded-2xl border border-slate-100 p-5'
                        >
                            <div
                                className={`jv-badge text-xs font-semibold mb-2 ${statusColors[status]}`}
                            >
                                {status}
                            </div>
                            <div className='text-2xl sm:text-3xl font-extrabold text-slate-900'>
                                {count}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                {bookings.length === 0 ? (
                    <div className='py-20 text-center text-slate-400'>
                        <div className='text-4xl mb-3'>📅</div>
                        <p>No bookings yet</p>
                    </div>
                ) : (
                    <div className='overflow-x-auto -mx-4 sm:mx-0'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b border-slate-100 bg-slate-50'>
                                    <th className='text-left px-6 py-3.5 font-semibold text-slate-600'>
                                        Customer
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Service
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Date
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600 hidden lg:table-cell'>
                                        Notes
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Status
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Contact
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-50'>
                                {bookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className='hover:bg-slate-50 transition-colors'
                                    >
                                        <td className='px-6 py-4'>
                                            <div className='font-semibold text-slate-900'>
                                                {booking.name}
                                            </div>
                                            <div className='text-xs text-slate-400'>
                                                {booking.email}
                                            </div>
                                        </td>
                                        <td className='px-4 py-4 text-slate-700 font-medium'>
                                            {booking.service.name}
                                        </td>
                                        <td className='px-4 py-4 text-slate-600 whitespace-nowrap'>
                                            {formatDate(booking.date)}
                                        </td>
                                        <td className='hidden lg:table-cell px-4 py-4 text-slate-500 max-w-xs'>
                                            <p className='text-xs line-clamp-2'>
                                                {booking.notes || '—'}
                                            </p>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <AdminBookingStatus
                                                id={booking.id}
                                                status={booking.status}
                                            />
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='flex gap-2'>
                                                <a
                                                    href={`tel:${booking.phone}`}
                                                    className='px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors'
                                                >
                                                    📞 Call
                                                </a>
                                                <a
                                                    href={`https://wa.me/${booking.phone.replace(/\D/g, '')}`}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='px-2.5 py-1.5 rounded-xl bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200 transition-colors'
                                                >
                                                    WhatsApp
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
