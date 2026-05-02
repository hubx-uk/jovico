// app/admin/subscribers/page.tsx
import { Download } from 'lucide-react'
import type { Metadata } from 'next'

import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Subscribers' }

export default async function AdminSubscribersPage() {
    const subscribers = await prisma.subscriber.findMany({
        orderBy: { createdAt: 'desc' },
    })
    const active = subscribers.filter((s) => s.active).length

    return (
        <div className='max-w-4xl mx-auto'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8'>
                <div>
                    <h1 className='text-2xl font-extrabold text-slate-900'>
                        Newsletter Subscribers
                    </h1>
                    <p className='text-slate-500 text-sm mt-0.5'>
                        {subscribers.length} total · {active} active
                    </p>
                </div>
                <a
                    href='/api/subscribers/export'
                    className='jv-btn-secondary flex items-center gap-2 text-sm'
                >
                    <Download className='w-4 h-4' /> Export CSV
                </a>
            </div>

            <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                {subscribers.length === 0 ? (
                    <div className='py-16 text-center text-slate-400'>
                        <div className='text-4xl mb-3'>📧</div>
                        <p>No subscribers yet</p>
                    </div>
                ) : (
                    <div className='overflow-x-auto -mx-4 sm:mx-0'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b border-slate-100 bg-slate-50'>
                                    <th className='text-left px-6 py-3.5 font-semibold text-slate-600'>
                                        Email
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Name
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Status
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-50'>
                                {subscribers.map((sub) => (
                                    <tr
                                        key={sub.id}
                                        className='hover:bg-slate-50 transition-colors'
                                    >
                                        <td className='px-6 py-4 font-medium text-slate-900'>
                                            {sub.email}
                                        </td>
                                        <td className='px-4 py-4 text-slate-600'>
                                            {sub.name ?? '—'}
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span
                                                className={`jv-badge text-xs font-semibold ${
                                                    sub.active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                {sub.active ? 'Active' : 'Unsubscribed'}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4 text-slate-500 text-xs'>
                                            {formatDate(sub.createdAt)}
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
