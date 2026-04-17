// app/(main)/account/profile/page.tsx
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCustomerSession } from '@/lib/customerAuth'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/account/ProfileForm'

export const metadata: Metadata = { title: 'My Profile' }

export const dynamic = 'force-dynamic' // always fresh

export default async function AccountProfilePage() {
    const session = await getCustomerSession()
    if (!session) redirect('/account/login')

    const customer = await prisma.customer.findUnique({
        where: { id: session.id, deletedAt: null },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            createdAt: true,
        },
    })
    if (!customer) redirect('/account/login')

    return (
        <div className='space-y-6 max-w-xl'>
            <h1 className='text-2xl font-extrabold text-slate-900'>My Profile</h1>
            <ProfileForm customer={customer} />

            {/* Member since */}
            <p className='text-xs text-slate-400 text-center'>
                Jovico member since{' '}
                {new Intl.DateTimeFormat('en-NG', { month: 'long', year: 'numeric' }).format(
                    customer.createdAt
                )}
            </p>
        </div>
    )
}
