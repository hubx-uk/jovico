// app/(main)/account/layout.tsx
// This layout wraps all authenticated account pages (dashboard, orders, profile, security).
// Login/Register live in app/(main)/(account-public)/account/ and don't use this layout.
import { redirect } from 'next/navigation'

import { getCustomerSession } from '@/lib/customerAuth'
import { AccountSidebar } from '@/components/account/AccountSidebar'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
    const session = await getCustomerSession()
    if (!session) redirect('/account/login')

    return (
        <div className='pt-20 sm:pt-24 min-h-screen bg-slate-50'>
            <div className='jv-container py-8 sm:py-12'>
                <div className='grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8'>
                    <AccountSidebar name={session.name} email={session.email} />
                    <main className='min-w-0'>{children}</main>
                </div>
            </div>
        </div>
    )
}
