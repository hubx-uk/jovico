// app/admin/layout.tsx
import type { Metadata } from 'next'

import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
    title: { default: 'Admin', template: '%s | Jovico Admin' },
    robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='min-h-screen bg-slate-50 flex'>
            <AdminSidebar />
            <div className='flex-1 flex flex-col min-w-0'>
                {/* pt-14 on mobile to clear the fixed AdminSidebar mobile header */}
                <main className='flex-1 p-4 pt-[calc(3.5rem+1rem)] lg:pt-6 lg:p-8 overflow-auto'>
                    {children}
                </main>
            </div>
        </div>
    )
}
