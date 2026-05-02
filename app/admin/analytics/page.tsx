// app/admin/analytics/page.tsx
import { TrendingUp, ShoppingCart, Eye, Users } from 'lucide-react'
import type { Metadata } from 'next'

import { prisma } from '@/lib/prisma'
import { formatNaira } from '@/lib/utils'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AdminAnalyticsPage() {
    const [totalOrders, paidOrders, totalRevenue, topProducts, topPosts, recentOrdersPerDay] =
        await Promise.all([
            prisma.order.count(),
            prisma.order.count({ where: { paymentStatus: 'PAID' } }),
            prisma.order.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { total: true },
            }),
            prisma.orderItem.groupBy({
                by: ['productId', 'name'],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5,
            }),
            prisma.post.findMany({
                where: { published: true },
                orderBy: { views: 'desc' },
                take: 5,
                select: { title: true, views: true, category: true, slug: true },
            }),
            prisma.order.findMany({
                select: { createdAt: true, total: true },
                orderBy: { createdAt: 'desc' },
                take: 30,
            }),
        ])

    const revenue = Number(totalRevenue._sum.total ?? 0)
    const conversionRate = totalOrders > 0 ? ((paidOrders / totalOrders) * 100).toFixed(1) : '0'

    const summaryCards = [
        {
            label: 'Total Revenue',
            value: formatNaira(revenue),
            icon: TrendingUp,
            color: 'bg-green-50 text-green-600',
        },
        {
            label: 'Total Orders',
            value: totalOrders.toString(),
            icon: ShoppingCart,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            label: 'Paid Orders',
            value: paidOrders.toString(),
            icon: ShoppingCart,
            color: 'bg-purple-50 text-purple-600',
        },
        {
            label: 'Conversion Rate',
            value: `${conversionRate}%`,
            icon: TrendingUp,
            color: 'bg-orange-50 text-orange-600',
        },
    ]

    return (
        <div className='max-w-6xl mx-auto'>
            <div className='mb-8'>
                <h1 className='text-2xl font-extrabold text-slate-900'>Analytics</h1>
                <p className='text-slate-500 text-sm mt-0.5'>Store performance overview</p>
            </div>

            {/* Summary */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                {summaryCards.map((card) => (
                    <div
                        key={card.label}
                        className='bg-white rounded-2xl border border-slate-100 p-6'
                    >
                        <div
                            className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}
                        >
                            <card.icon className='w-5 h-5' />
                        </div>
                        <div className='text-2xl font-extrabold text-slate-900 mb-1'>
                            {card.value}
                        </div>
                        <div className='text-xs text-slate-500'>{card.label}</div>
                    </div>
                ))}
            </div>

            <div className='grid lg:grid-cols-2 gap-6'>
                {/* Top Products by Orders */}
                <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                    <div className='px-6 py-4 border-b border-slate-100'>
                        <h2 className='font-bold text-slate-900'>Top Products Ordered</h2>
                    </div>
                    {topProducts.length === 0 ? (
                        <div className='py-12 text-center text-slate-400 text-sm'>
                            No order data yet
                        </div>
                    ) : (
                        <div className='divide-y divide-slate-50'>
                            {topProducts.map((item, i) => (
                                <div
                                    key={item.productId}
                                    className='flex items-center gap-4 px-6 py-4'
                                >
                                    <div className='w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0'>
                                        {i + 1}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='font-semibold text-slate-900 text-sm truncate'>
                                            {item.name}
                                        </div>
                                    </div>
                                    <div className='text-sm font-bold text-slate-900'>
                                        {item._sum.quantity ?? 0} sold
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Blog Posts */}
                <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                    <div className='px-6 py-4 border-b border-slate-100'>
                        <h2 className='font-bold text-slate-900 flex items-center gap-2'>
                            <Eye className='w-4 h-4 text-slate-500' /> Top Blog Posts
                        </h2>
                    </div>
                    {topPosts.length === 0 ? (
                        <div className='py-12 text-center text-slate-400 text-sm'>
                            No published posts yet
                        </div>
                    ) : (
                        <div className='divide-y divide-slate-50'>
                            {topPosts.map((post, i) => (
                                <div key={post.slug} className='flex items-center gap-4 px-6 py-4'>
                                    <div className='w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0'>
                                        {i + 1}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='font-semibold text-slate-900 text-sm truncate'>
                                            {post.title}
                                        </div>
                                        <div className='text-xs text-slate-400'>
                                            {post.category}
                                        </div>
                                    </div>
                                    <div className='text-sm font-bold text-slate-900 whitespace-nowrap'>
                                        {post.views.toLocaleString()} views
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent orders table */}
            <div className='mt-6 bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                <div className='px-6 py-4 border-b border-slate-100'>
                    <h2 className='font-bold text-slate-900'>Recent Order Revenue (Last 30)</h2>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='border-b border-slate-50 bg-slate-50'>
                                <th className='text-left px-6 py-3 font-semibold text-slate-500'>
                                    Date
                                </th>
                                <th className='text-right px-6 py-3 font-semibold text-slate-500'>
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-50'>
                            {recentOrdersPerDay.slice(0, 10).map((order) => (
                                <tr key={order.createdAt.toString()} className='hover:bg-slate-50'>
                                    <td className='px-6 py-3 text-slate-600'>
                                        {new Intl.DateTimeFormat('en-NG', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }).format(order.createdAt)}
                                    </td>
                                    <td className='px-6 py-3 text-right font-bold text-slate-900'>
                                        {formatNaira(Number(order.total))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
