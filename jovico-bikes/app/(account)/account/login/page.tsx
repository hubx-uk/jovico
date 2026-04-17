import { Zap } from 'lucide-react'
// app/(account)/account/login/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { CustomerLoginForm } from '@/components/account/CustomerLoginForm'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
    return (
        <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24'>
            <div className='w-full max-w-sm'>
                {/* Logo */}
                <div className='text-center mb-7'>
                    <Link href='/' className='inline-flex items-center gap-2 group mb-5'>
                        <div className='w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-green-500 transition-colors'>
                            <Zap className='w-5 h-5 text-white' />
                        </div>
                        <span className='font-bold text-slate-900 text-lg'>
                            Jovico<span className='text-green-500'>.</span>
                        </span>
                    </Link>
                    <h1 className='text-2xl font-extrabold text-slate-900'>Welcome back</h1>
                    <p className='text-slate-500 text-sm mt-1'>Sign in to your account</p>
                </div>

                {/* Form card */}
                <div className='bg-white rounded-3xl border border-slate-100 shadow-sm p-7'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <CustomerLoginForm mode='login' />
                    </Suspense>
                    <p className='text-center text-sm text-slate-500 mt-5'>
                        Don&apos;t have an account?{' '}
                        <Link
                            href='/account/register'
                            className='font-semibold text-green-600 hover:text-green-700'
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
