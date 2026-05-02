// app/admin/login/page.tsx
import type { Metadata } from 'next'
import { Zap } from 'lucide-react'

import { AdminLoginForm } from '@/components/admin/AdminLoginForm'

export const metadata: Metadata = { title: 'Admin Login' }

export default function AdminLoginPage() {
    return (
        <div className='min-h-screen bg-slate-950 flex items-center justify-center p-4'>
            {/* Background */}
            <div
                className='absolute inset-0 opacity-[0.04] pointer-events-none'
                style={{
                    backgroundImage:
                        'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-500/5 blur-3xl pointer-events-none' />

            <div className='relative w-full max-w-sm px-4 sm:px-0'>
                {/* Logo */}
                <div className='text-center mb-6 sm:mb-8'>
                    <div className='w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                        <Zap className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
                    </div>
                    <h1 className='text-xl sm:text-2xl font-extrabold text-white'>
                        Jovico<span className='text-green-400'>.</span> Admin
                    </h1>
                    <p className='text-slate-500 text-sm mt-1'>Sign in to manage your store</p>
                </div>

                {/* Form card */}
                <div className='bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl'>
                    <AdminLoginForm />
                </div>

                <p className='text-center text-slate-600 text-xs mt-6'>
                    © {new Date().getFullYear()} Jovico Bikes Ltd. All rights reserved.
                </p>
            </div>
        </div>
    )
}
