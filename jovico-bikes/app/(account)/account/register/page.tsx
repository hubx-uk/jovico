import { CustomerLoginForm } from '@/components/account/CustomerLoginForm'
import { Zap } from 'lucide-react'
// app/(account)/account/register/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
    return (
        <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24'>
            <div className='w-full max-w-sm'>
                <div className='text-center mb-7'>
                    <Link href='/' className='inline-flex items-center gap-2 group mb-5'>
                        <div className='w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-green-500 transition-colors'>
                            <Zap className='w-5 h-5 text-white' />
                        </div>
                        <span className='font-bold text-slate-900 text-lg'>
                            Jovico<span className='text-green-500'>.</span>
                        </span>
                    </Link>
                    <h1 className='text-2xl font-extrabold text-slate-900'>Create your account</h1>
                    <p className='text-slate-500 text-sm mt-1'>
                        Track orders and manage your profile
                    </p>
                </div>

                <div className='bg-white rounded-3xl border border-slate-100 shadow-sm p-7'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <CustomerLoginForm mode='register' />
                    </Suspense>
                    <p className='text-center text-sm text-slate-500 mt-5'>
                        Already have an account?{' '}
                        <Link
                            href='/account/login'
                            className='font-semibold text-green-600 hover:text-green-700'
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
