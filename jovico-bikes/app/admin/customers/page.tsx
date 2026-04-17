// app/admin/customers/page.tsx
import { Users, UserCheck, UserX, Search, ExternalLink, MailIcon, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Customers' }
export const dynamic = 'force-dynamic'

interface PageProps {
    searchParams: Promise<{
        q?: string
        filter?: string
        page?: string
    }>
}

export default async function AdminCustomersPage({ searchParams }: PageProps) {
    const params = await searchParams
    const q = params.q ?? ''
    const filter = params.filter ?? 'all'
    const page = Math.max(1, Number(params.page ?? 1))
    const limit = 20
    const skip = (page - 1) * limit

    const where = {
        ...(q
            ? {
                  OR: [
                      { name: { contains: q } },
                      { email: { contains: q } },
                      { phone: { contains: q } },
                  ],
              }
            : {}),
        ...(filter === 'active' ? { deletedAt: null } : {}),
        ...(filter === 'deleted' ? { deletedAt: { not: null } } : {}),
    }

    const [customers, total, activeCount, deletedCount] = await Promise.all([
        prisma.customer.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                deletedAt: true,
                createdAt: true,
                _count: { select: { orders: true } },
            },
        }),
        prisma.customer.count({ where }),
        prisma.customer.count({ where: { deletedAt: null } }),
        prisma.customer.count({ where: { deletedAt: { not: null } } }),
    ])

    const totalPages = Math.ceil(total / limit)

    const buildUrl = (overrides: Record<string, string>) => {
        const p = new URLSearchParams()
        if (q) p.set('q', q)
        if (filter !== 'all') p.set('filter', filter)
        if (page > 1) p.set('page', String(page))
        Object.entries(overrides).forEach(([k, v]) => {
            if (v) p.set(k, v)
            else p.delete(k)
        })
        const s = p.toString()
        return `/admin/customers${s ? `?${s}` : ''}`
    }

    const filterTabs = [
        { value: 'all', label: 'All', count: activeCount + deletedCount, icon: Users },
        { value: 'active', label: 'Active', count: activeCount, icon: UserCheck },
        { value: 'deleted', label: 'Deleted', count: deletedCount, icon: UserX },
    ]

    return (
        <div className='max-w-7xl mx-auto'>
            {/* ── Header ─────────────────────────────────────── */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8'>
                <div>
                    <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900'>Customers</h1>
                    <p className='text-slate-500 text-sm mt-0.5'>
                        {activeCount} active · {deletedCount} soft-deleted
                    </p>
                </div>
            </div>

            {/* ── Stat cards ─────────────────────────────────── */}
            <div className='grid grid-cols-3 gap-3 sm:gap-4 mb-6'>
                {filterTabs.map((tab) => (
                    <Link
                        key={tab.value}
                        href={buildUrl({ filter: tab.value === 'all' ? '' : tab.value, page: '' })}
                        className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all hover:shadow-sm ${
                            filter === tab.value || (tab.value === 'all' && !filter)
                                ? 'border-slate-900 ring-1 ring-slate-900'
                                : 'border-slate-100'
                        }`}
                    >
                        <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${
                                tab.value === 'active'
                                    ? 'bg-green-100 text-green-600'
                                    : tab.value === 'deleted'
                                      ? 'bg-red-100 text-red-500'
                                      : 'bg-amber-100 text-amber-600'
                            }`}
                        >
                            <tab.icon className='w-4.5 h-4.5' style={{ width: 18, height: 18 }} />
                        </div>
                        <div className='text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums'>
                            {tab.count}
                        </div>
                        <div className='text-xs text-slate-500 mt-0.5'>{tab.label} Customers</div>
                    </Link>
                ))}
            </div>

            {/* ── Search ─────────────────────────────────────── */}
            <div className='bg-white rounded-2xl border border-slate-100 p-4 mb-4'>
                <form method='GET' action='/admin/customers' className='flex gap-3'>
                    <input type='hidden' name='filter' value={filter} />
                    <div className='relative flex-1'>
                        <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none' />
                        <input
                            type='search'
                            name='q'
                            defaultValue={q}
                            placeholder='Search by name, email or phone…'
                            className='jv-input pl-10 text-sm'
                        />
                    </div>
                    <button type='submit' className='jv-btn-primary text-sm !px-5 !py-2.5'>
                        Search
                    </button>
                    {q && (
                        <Link
                            href={buildUrl({ q: '', page: '' })}
                            className='jv-btn-secondary !border-slate-200 !text-slate-600 text-sm !px-4 !py-2.5'
                        >
                            Clear
                        </Link>
                    )}
                </form>
            </div>

            {/* ── Table ──────────────────────────────────────── */}
            <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                {customers.length === 0 ? (
                    <div className='py-20 text-center'>
                        <Users className='w-10 h-10 mx-auto mb-3 text-slate-200' />
                        <p className='font-semibold text-slate-600'>
                            {q ? `No customers matching "${q}"` : 'No customers yet'}
                        </p>
                        {q && (
                            <Link
                                href='/admin/customers'
                                className='text-sm text-green-600 mt-2 inline-block'
                            >
                                Clear search
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className='hidden md:block overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='border-b border-slate-100 bg-slate-50'>
                                        <th className='text-left px-5 py-3.5 font-semibold text-slate-600'>
                                            Customer
                                        </th>
                                        <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                            Contact
                                        </th>
                                        <th className='text-center px-4 py-3.5 font-semibold text-slate-600'>
                                            Orders
                                        </th>
                                        <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                            Status
                                        </th>
                                        <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                            Joined
                                        </th>
                                        <th className='text-right px-5 py-3.5 font-semibold text-slate-600'></th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-slate-50'>
                                    {customers.map((c) => (
                                        <tr
                                            key={c.id}
                                            className={`hover:bg-slate-50 transition-colors ${c.deletedAt ? 'opacity-60' : ''}`}
                                        >
                                            <td className='px-5 py-4'>
                                                <div className='flex items-center gap-3'>
                                                    <div
                                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                                            c.deletedAt
                                                                ? 'bg-slate-100 text-slate-400'
                                                                : 'bg-amber-500 text-white'
                                                        }`}
                                                    >
                                                        {c.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className='font-semibold text-slate-900'>
                                                            {c.name}
                                                        </div>
                                                        <div className='text-xs text-slate-400 flex items-center gap-1'>
                                                            <MailIcon className='w-3 h-3' />
                                                            {c.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-4 py-4'>
                                                {c.phone ? (
                                                    <a
                                                        href={`tel:${c.phone}`}
                                                        className='flex items-center gap-1.5 text-xs text-slate-600 hover:text-green-600 transition-colors'
                                                    >
                                                        <Phone className='w-3 h-3' />
                                                        {c.phone}
                                                    </a>
                                                ) : (
                                                    <span className='text-xs text-slate-400'>
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className='px-4 py-4 text-center'>
                                                <span className='text-sm font-bold text-slate-900'>
                                                    {c._count.orders}
                                                </span>
                                            </td>
                                            <td className='px-4 py-4'>
                                                {c.deletedAt ? (
                                                    <span className='jv-badge bg-red-100 text-red-600 text-xs font-semibold'>
                                                        Deleted
                                                    </span>
                                                ) : (
                                                    <span className='jv-badge bg-green-100 text-green-700 text-xs font-semibold'>
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className='px-4 py-4 text-xs text-slate-500 whitespace-nowrap'>
                                                {formatDate(c.createdAt)}
                                            </td>
                                            <td className='px-5 py-4 text-right'>
                                                <Link
                                                    href={`/admin/customers/${c.id}`}
                                                    className='inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-green-600 transition-colors'
                                                >
                                                    View <ExternalLink className='w-3 h-3' />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className='md:hidden divide-y divide-slate-50'>
                            {customers.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/admin/customers/${c.id}`}
                                    className={`flex items-center gap-4 px-4 py-4 hover:bg-slate-50 transition-colors ${c.deletedAt ? 'opacity-60' : ''}`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                            c.deletedAt
                                                ? 'bg-slate-100 text-slate-400'
                                                : 'bg-amber-500 text-white'
                                        }`}
                                    >
                                        {c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='font-semibold text-slate-900 text-sm truncate'>
                                            {c.name}
                                        </div>
                                        <div className='text-xs text-slate-400 truncate'>
                                            {c.email}
                                        </div>
                                    </div>
                                    <div className='text-right shrink-0'>
                                        <div className='text-sm font-bold text-slate-900'>
                                            {c._count.orders} orders
                                        </div>
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.deletedAt ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}
                                        >
                                            {c.deletedAt ? 'Deleted' : 'Active'}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className='flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50'>
                                <p className='text-xs text-slate-500'>
                                    Showing {skip + 1}–{Math.min(skip + limit, total)} of {total}
                                </p>
                                <div className='flex gap-2'>
                                    {page > 1 && (
                                        <Link
                                            href={buildUrl({ page: String(page - 1) })}
                                            className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                        >
                                            ← Prev
                                        </Link>
                                    )}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const p =
                                            Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                                        return p <= totalPages ? (
                                            <Link
                                                key={p}
                                                href={buildUrl({ page: p === 1 ? '' : String(p) })}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                                                    p === page
                                                        ? 'bg-slate-900 text-white border-slate-900'
                                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                {p}
                                            </Link>
                                        ) : null
                                    })}
                                    {page < totalPages && (
                                        <Link
                                            href={buildUrl({ page: String(page + 1) })}
                                            className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                        >
                                            Next →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
