// app/admin/shop/page.tsx
import { Plus, Pencil, Eye, EyeOff, Package } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { prisma } from '@/lib/prisma'
import { formatNaira } from '@/lib/utils'
import { AdminDeletePost } from '@/components/admin/AdminDeletePost'
import { AdminToggleProduct } from '@/components/admin/AdminToggleProduct'

export const metadata: Metadata = { title: 'Products' }

export default async function AdminShopPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { images: { where: { isPrimary: true }, take: 1 } },
    })

    return (
        <div className='max-w-7xl mx-auto'>
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h1 className='text-2xl font-extrabold text-slate-900'>Products</h1>
                    <p className='text-slate-500 text-sm mt-0.5'>
                        {products.length} total products
                    </p>
                </div>
                <Link href='/admin/shop/new' className='jv-btn-primary'>
                    <Plus className='w-4 h-4' /> Add Product
                </Link>
            </div>

            <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                {products.length === 0 ? (
                    <div className='py-20 text-center text-slate-400'>
                        <Package className='w-10 h-10 mx-auto mb-2 opacity-30' />
                        <p className='font-semibold text-slate-600'>No products yet</p>
                        <p className='text-sm mt-1 mb-6'>
                            Add your first product to start selling.
                        </p>
                        <Link href='/admin/shop/new' className='jv-btn-primary'>
                            <Plus className='w-4 h-4' /> Add Product
                        </Link>
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b border-slate-100 bg-slate-50'>
                                    <th className='text-left px-6 py-3.5 font-semibold text-slate-600'>
                                        Product
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        SKU
                                    </th>
                                    <th className='text-left px-4 py-3.5 font-semibold text-slate-600'>
                                        Category
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
                                {products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className='hover:bg-slate-50 transition-colors'
                                    >
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0'>
                                                    🚴
                                                </div>
                                                <div>
                                                    <div className='font-semibold text-slate-900 line-clamp-1'>
                                                        {product.name}
                                                    </div>
                                                    <div className='text-xs text-slate-400'>
                                                        {product.brand}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span className='font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg'>
                                                {product.sku}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span className='jv-badge bg-slate-100 text-slate-600 text-xs'>
                                                {product.category.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4 text-right font-bold text-slate-900'>
                                            {formatNaira(Number(product.price))}
                                        </td>
                                        <td className='px-4 py-4 text-center'>
                                            <span
                                                className={`text-sm font-bold ${
                                                    product.stock === 0
                                                        ? 'text-red-500'
                                                        : product.stock < 5
                                                          ? 'text-orange-500'
                                                          : 'text-slate-900'
                                                }`}
                                            >
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <AdminToggleProduct
                                                id={product.id}
                                                published={product.published}
                                            />
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center justify-end gap-2'>
                                                {product.published && (
                                                    <Link
                                                        href={`/shop/${product.slug}`}
                                                        target='_blank'
                                                        className='p-2 rounded-xl text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors'
                                                    >
                                                        <Eye className='w-4 h-4' />
                                                    </Link>
                                                )}
                                                <Link
                                                    href={`/admin/shop/${product.id}`}
                                                    className='p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors'
                                                >
                                                    <Pencil className='w-4 h-4' />
                                                </Link>
                                                <AdminDeletePost
                                                    id={product.id}
                                                    title={product.name}
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
