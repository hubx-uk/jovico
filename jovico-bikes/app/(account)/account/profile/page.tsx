import { AccountSidebar } from '@/components/account/AccountSidebar'
import { DeleteAccountButton } from '@/components/account/DeleteAccountButton'
import { PasswordForm } from '@/components/account/PasswordForm'
import { ProfileForm } from '@/components/account/ProfileForm'
import { getCustomerSession } from '@/lib/customerAuth'
import { prisma } from '@/lib/prisma'
// app/(account)/account/profile/page.tsx
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Profile & Password' }

export const dynamic = 'force-dynamic' // always fresh

export default async function AccountProfilePage() {
    const session = await getCustomerSession()
    if (!session) redirect('/account/login')

    const customer = await prisma.customer.findUnique({
        where: { id: session.id, deletedAt: null },
        select: { id: true, name: true, email: true, phone: true, address: true },
    })

    if (!customer) redirect('/account/login')

    return (
        <div className='jv-container py-10 md:py-14 pt-28 sm:pt-32'>
            <div className='grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-6'>
                <AccountSidebar name={customer.name} email={customer.email} />

                <div className='space-y-6'>
                    <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900'>
                        Profile & Password
                    </h1>

                    {/* Profile info */}
                    <ProfileForm customer={customer} />

                    {/* Change password */}
                    <PasswordForm />

                    {/* Danger zone */}
                    <div className='bg-red-50 border border-red-200 rounded-2xl p-5 sm:p-6'>
                        <h2 className='font-bold text-red-800 mb-1'>Danger Zone</h2>
                        <p className='text-sm text-red-700 mb-4'>
                            Deleting your account is permanent. Your personal data will be removed
                            and you will be logged out immediately. Your order history will be
                            anonymised and retained for legal purposes.
                        </p>
                        <DeleteAccountButton />
                    </div>
                </div>
            </div>
        </div>
    )
}
