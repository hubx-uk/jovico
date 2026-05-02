// app/admin/settings/page.tsx
import type { Metadata } from 'next'

import { prisma } from '@/lib/prisma'
import { AdminSettingsForm } from '@/components/admin/AdminSettingsForm'

export const metadata: Metadata = { title: 'Settings' }

export default async function AdminSettingsPage() {
    const settings = await prisma.siteSetting.findMany()
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

    return (
        <div className='max-w-2xl mx-auto'>
            <div className='mb-8'>
                <h1 className='text-2xl font-extrabold text-slate-900'>Site Settings</h1>
                <p className='text-slate-500 text-sm mt-0.5'>
                    Manage your store's contact info and social links.
                </p>
            </div>
            <AdminSettingsForm settings={settingsMap} />
        </div>
    )
}
