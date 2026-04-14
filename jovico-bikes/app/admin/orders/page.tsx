// app/admin/orders/page.tsx
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatNaira, formatDate } from '@/lib/utils'
import { AdminOrderStatusSelect } from '@/components/admin/AdminOrderStatusSelect'

export const metadata: Metadata = { title: 'Orders' }

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            items: { include: { product: { select: { name: true } } } },
        },
    })

    const statColors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    }
    const payColors: Record<string, string> = {
        UNPAID: 'bg-slate-100 text-slate-600',
        PAID: 'bg-green-100 text-green-700',
        REFUNDED: 'bg-orange-100 text-orange-700',
    }

    return (
        <div className='max-w-7xl mx-auto'>
            <div className='mb-8'>
                <h1 className='text-2xl font-extrabold text-slate-900'>Orders</h1>
                <p className='text-slate-500 text-sm mt-0.5'>{orders.length} total orders</p>
            </div>

            <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                {orders.length === 0 ? (
                    <div className='py-20 text-center text-slate-400'>
                        <div className='text-4xl mb-3'>📦</div>
                        <p className='font-semibold text-slate-600'>No orders yet</p>
                        <p className='text-sm mt-1'>
                            Orders will appear here once customers start purchasing.
                        </p>
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b border-slate-100 bg-slate-50'>
                                    <th className='text-left px-6 py-3.5 font-semibold text-slate-600'>
                                        Order
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Customer
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Items
                                    </th>
                                    <th className='text-right px-4 py-3.5 font-semibold text-slate-600'>
                                        Total
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Payment
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
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className='hover:bg-slate-50 transition-colors'
                                    >
                                        <td className='px-6 py-4'>
                                            <span className='font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg'>
                                                {order.orderNumber}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='font-semibold text-slate-900'>
                                                {order.customerName}
                                            </div>
                                            <div className='text-xs text-slate-400'>
                                                {order.customerEmail}
                                            </div>
                                        </td>
                                        <td className='px-4 py-4 text-slate-600'>
                                            {order.items.length} item
                                            {order.items.length !== 1 ? 's' : ''}
                                        </td>
                                        <td className='px-4 py-4 text-right font-bold text-slate-900'>
                                            {formatNaira(Number(order.total))}
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span
                                                className={`jv-badge text-xs font-semibold ${payColors[order.paymentStatus]}`}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <AdminOrderStatusSelect
                                                id={order.id}
                                                status={order.status}
                                            />
                                        </td>
                                        <td className='px-4 py-4 text-slate-500 text-xs whitespace-nowrap'>
                                            {formatDate(order.createdAt)}
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
