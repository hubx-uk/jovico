// app/admin/enquiries/page.tsx
import type { Metadata } from 'next'

import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { AdminMarkRead } from '@/components/admin/AdminMarkRead'

export const metadata: Metadata = { title: 'Enquiries' }

export default async function AdminEnquiriesPage() {
    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
    })
    const unread = messages.filter((m) => !m.read).length

    return (
        <div className='max-w-4xl mx-auto'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8'>
                <div>
                    <h1 className='text-2xl font-extrabold text-slate-900'>Enquiries</h1>
                    <p className='text-slate-500 text-sm mt-0.5'>
                        {messages.length} total · {unread} unread
                    </p>
                </div>
            </div>

            <div className='space-y-3'>
                {messages.length === 0 ? (
                    <div className='bg-white rounded-2xl border border-slate-100 py-16 text-center text-slate-400'>
                        <div className='text-4xl mb-3'>✉️</div>
                        <p>No messages yet</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                                msg.read ? 'border-slate-100' : 'border-green-200 shadow-sm'
                            }`}
                        >
                            <div className='p-5'>
                                <div className='flex items-start justify-between gap-4'>
                                    <div className='flex items-start gap-3 flex-1 min-w-0'>
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                                msg.read
                                                    ? 'bg-slate-100 text-slate-600'
                                                    : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {msg.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex flex-wrap items-center gap-2 mb-1'>
                                                <span className='font-bold text-slate-900'>
                                                    {msg.name}
                                                </span>
                                                {!msg.read && (
                                                    <span className='jv-badge bg-green-100 text-green-700 text-xs'>
                                                        New
                                                    </span>
                                                )}
                                                <span className='jv-badge bg-slate-100 text-slate-600 text-xs'>
                                                    {msg.subject}
                                                </span>
                                            </div>
                                            <div className='text-xs text-slate-400 mb-2'>
                                                {msg.email}
                                                {msg.phone && ` · ${msg.phone}`}
                                                {' · '}
                                                {formatDate(msg.createdAt)}
                                            </div>
                                            <p className='text-sm text-slate-600 leading-relaxed'>
                                                {msg.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 shrink-0'>
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                            className='px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors'
                                        >
                                            Reply
                                        </a>
                                        {!msg.read && <AdminMarkRead id={msg.id} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
