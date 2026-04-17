// app/(main)/account/security/page.tsx
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCustomerSession } from '@/lib/customerAuth'
import { PasswordForm } from '@/components/account/PasswordForm'
import { DeleteAccountButton } from '@/components/account/DeleteAccountButton'
import { ShieldCheck, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = { title: 'Password & Security' }

export const dynamic = 'force-dynamic' // always fresh

export default async function AccountSecurityPage() {
    const session = await getCustomerSession()
    if (!session) redirect('/account/login')

    return (
        <div className='space-y-6 max-w-xl'>
            <h1 className='text-2xl font-extrabold text-slate-900'>Password & Security</h1>

            {/* Security status banner */}
            <div className='flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4'>
                <ShieldCheck className='w-5 h-5 text-green-600 shrink-0' />
                <div>
                    <p className='text-sm font-semibold text-green-800'>Account Secured</p>
                    <p className='text-xs text-green-600'>
                        Your account is protected with a password. Keep it unique and strong.
                    </p>
                </div>
            </div>

            {/* Password change form */}
            <PasswordForm />

            {/* Danger zone */}
            <div className='bg-white rounded-2xl border border-red-200 p-5 sm:p-6'>
                <div className='flex items-start gap-3 mb-5'>
                    <AlertTriangle className='w-5 h-5 text-red-500 shrink-0 mt-0.5' />
                    <div>
                        <h2 className='font-bold text-red-700'>Danger Zone</h2>
                        <p className='text-xs text-red-500 mt-0.5'>
                            Deleting your account will remove all your data permanently. Your order
                            history will be retained for legal purposes but will no longer be
                            accessible to you.
                        </p>
                    </div>
                </div>
                <DeleteAccountButton />
            </div>
        </div>
    )
}
