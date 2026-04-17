import { AdminToggleService } from '@/components/admin/AdminToggleService'
import { prisma } from '@/lib/prisma'
import { formatNaira } from '@/lib/utils'
import { Pencil, Plus, Wrench } from 'lucide-react'
// app/admin/services/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Services' }

export default async function AdminServicesPage() {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })

    return (
        <div className='max-w-5xl mx-auto'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8'>
                <div>
                    <h1 className='text-2xl font-extrabold text-slate-900'>Services</h1>
                    <p className='text-slate-500 text-sm mt-0.5'>
                        {services.length} services configured
                    </p>
                </div>
                <Link href='/admin/services/new' className='jv-btn-primary'>
                    <Plus className='w-4 h-4' /> Add Service
                </Link>
            </div>

            <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
                {services.length === 0 ? (
                    <div className='py-20 text-center text-slate-400'>
                        <Wrench className='w-10 h-10 mx-auto mb-2 opacity-30' />
                        <p className='font-semibold text-slate-600'>No services yet</p>
                        <p className='text-sm mt-1 mb-6'>Add your first service offering.</p>
                        <Link href='/admin/services/new' className='jv-btn-primary'>
                            <Plus className='w-4 h-4' /> Add Service
                        </Link>
                    </div>
                ) : (
                    <div className='divide-y divide-slate-50'>
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className='flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors'
                            >
                                <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0'>
                                    <Wrench className='w-5 h-5 text-slate-600' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='font-semibold text-slate-900'>
                                        {service.name}
                                    </div>
                                    <div className='text-xs text-slate-400 line-clamp-1 mt-0.5'>
                                        {service.shortDesc}
                                    </div>
                                </div>
                                <div className='text-right shrink-0'>
                                    <div className='font-bold text-slate-900 text-sm'>
                                        {service.price
                                            ? formatNaira(Number(service.price))
                                            : 'Quote'}
                                    </div>
                                    {service.duration && (
                                        <div className='text-xs text-slate-400'>
                                            {service.duration}
                                        </div>
                                    )}
                                </div>
                                <AdminToggleService id={service.id} published={service.published} />
                                <Link
                                    href={`/admin/services/${service.id}`}
                                    className='p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors'
                                >
                                    <Pencil className='w-4 h-4' />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
