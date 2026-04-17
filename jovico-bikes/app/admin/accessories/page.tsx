import { AdminDeletePost } from '@/components/admin/AdminDeletePost'
import { AdminToggleProduct } from '@/components/admin/AdminToggleProduct'
import { prisma } from '@/lib/prisma'
import { formatNaira } from '@/lib/utils'
import { Package, Pencil, Plus } from 'lucide-react'
// app/admin/accessories/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Accessories' }

export default async function AdminAccessoriesPage() {
    const accessories = await prisma.product.findMany({
        where: { type: { in: ['ACCESSORY', 'PART', 'APPAREL'] } },
        orderBy: { createdAt: 'desc' },
        include: { images: { where: { isPrimary: true }, take: 1 } },
    })

    return (
        <div className='max-w-7xl mx-auto'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8'>
                <div>
                    <h1 className='text-2xl font-extrabold text-slate-900'>Accessories</h1>
                    <p className='text-slate-500 text-sm mt-0.5'>
                        {accessories.length} accessories, parts & apparel
                    </p>
                </div>
                <Link href='/admin/shop/new' className='jv-btn-primary'>
                    <Plus className='w-4 h-4' /> Add Accessory
                </Link>
            </div>

            {/* Info banner */}
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3'>
                <span className='text-blue-500 mt-0.5 shrink-0'>ℹ️</span>
                <p className='text-sm text-blue-700'>
                    Accessories are managed through the same product system as bikes. Use the{' '}
                    <strong>Add Accessory</strong> button above, select type{' '}
                    <strong>ACCESSORY</strong>, <strong>PART</strong>, or <strong>APPAREL</strong>{' '}
                    when creating.
                </p>
            </div>

            <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                {accessories.length === 0 ? (
                    <div className='py-20 text-center text-slate-400'>
                        <Package className='w-10 h-10 mx-auto mb-2 opacity-30' />
                        <p className='font-semibold text-slate-600'>No accessories yet</p>
                        <p className='text-sm mt-1 mb-6'>
                            Add helmets, locks, chargers and other accessories.
                        </p>
                        <Link href='/admin/shop/new' className='jv-btn-primary'>
                            <Plus className='w-4 h-4' /> Add Accessory
                        </Link>
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b border-slate-100 bg-slate-50'>
                                    <th className='text-left px-6 py-3.5 font-semibold text-slate-600'>
                                        Name
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        SKU
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Type
                                    </th>
                                    <th className='text-right px-4 py-3.5 font-semibold text-slate-600'>
                                        Price
                                    </th>
                                    <th className='text-center px-4 py-3.5 font-semibold text-slate-600'>
                                        Stock
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Status
                                    </th>
                                    <th className='text-right px-6 py-3.5 font-semibold text-slate-600'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-50'>
                                {accessories.map((item) => (
                                    <tr
                                        key={item.id}
                                        className='hover:bg-slate-50 transition-colors'
                                    >
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0'>
                                                    🎽
                                                </div>
                                                <div>
                                                    <div className='font-semibold text-slate-900 line-clamp-1'>
                                                        {item.name}
                                                    </div>
                                                    <div className='text-xs text-slate-400'>
                                                        {item.brand}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span className='font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg'>
                                                {item.sku}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span className='jv-badge bg-purple-100 text-purple-700 text-xs'>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4 text-right font-bold text-slate-900'>
                                            {formatNaira(Number(item.price))}
                                        </td>
                                        <td className='px-4 py-4 text-center'>
                                            <span
                                                className={`text-sm font-bold ${
                                                    item.stock === 0
                                                        ? 'text-red-500'
                                                        : item.stock < 5
                                                          ? 'text-orange-500'
                                                          : 'text-slate-900'
                                                }`}
                                            >
                                                {item.stock}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <AdminToggleProduct
                                                id={item.id}
                                                published={item.published}
                                            />
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center justify-end gap-2'>
                                                <Link
                                                    href={`/admin/shop/${item.id}`}
                                                    className='p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors'
                                                >
                                                    <Pencil className='w-4 h-4' />
                                                </Link>
                                                <AdminDeletePost
                                                    id={item.id}
                                                    title={item.name}
                                                    resource='products'
                                                />
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
