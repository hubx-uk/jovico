import { ServiceEditor } from '@/components/admin/ServiceEditor'
// app/admin/services/new/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Service' }

export default function NewServicePage() {
    return (
        <div className='max-w-2xl mx-auto'>
            <h1 className='text-2xl font-extrabold text-slate-900 mb-8'>Add New Service</h1>
            <ServiceEditor service={null} mode='create' />
        </div>
    )
}
