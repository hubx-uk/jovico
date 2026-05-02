// app/admin/services/[id]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { prisma } from '@/lib/prisma'
import type { ServiceEditorData } from '@/types'
import { ServiceEditor } from '@/components/admin/ServiceEditor'

export const metadata: Metadata = { title: 'Edit Service' }

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const service = (await prisma.service.findUnique({ where: { id } })) as ServiceEditorData
    if (!service) notFound()

    return (
        <div className='max-w-2xl mx-auto'>
            <h1 className='text-2xl font-extrabold text-slate-900 mb-8'>Edit Service</h1>
            <ServiceEditor service={service} mode='edit' />
        </div>
    )
}
