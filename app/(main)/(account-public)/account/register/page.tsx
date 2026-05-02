// app/(main)/account/register/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { CustomerLoginForm } from '@/components/account/CustomerLoginForm'

export const metadata: Metadata = {
    title: 'Create Account',
    description: 'Create your Jovico Bikes account to track orders and manage your profile.',
}

export default function AccountRegisterPage() {
    return (
        <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24'>
            <div className='w-full max-w-sm'>
                <div className='text-center mb-8'>
                    <Link href='/' className='inline-flex items-center gap-2 group'>
                        <div className='w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-green-500 transition-colors'>
                            {/* <Bike className="w-5 h-5 text-white" /> */}
                            <Image
                                src={'/images/logo_sq.png'}
                                alt='Jovico Logo'
                                width={20}
                                height={20}
                            />
                        </div>
                        <span className='font-bold text-slate-900 text-lg'>
                            Jovico<span className='text-green-500'>.</span>
                        </span>
                    </Link>
                    <h1 className='text-2xl font-extrabold text-slate-900 mt-5 mb-1'>
                        Create account
                    </h1>
                    <p className='text-slate-500 text-sm'>Track orders, save your details</p>
                </div>

                <div className='bg-white rounded-3xl border border-slate-100 shadow-sm p-7'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <CustomerLoginForm mode='register' />
                    </Suspense>
                </div>

                <p className='text-center text-slate-500 text-sm mt-5'>
                    Already have an account?{' '}
                    <Link
                        href='/account/login'
                        className='text-green-600 font-semibold hover:text-green-700'
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
