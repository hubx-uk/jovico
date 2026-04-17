// app/not-found.tsx
import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'

export default function NotFound() {
    return (
        <div className='min-h-screen bg-slate-950 flex items-center justify-center p-6'>
            <div
                className='absolute inset-0 opacity-[0.03] pointer-events-none'
                style={{
                    backgroundImage:
                        'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />
            <div className='relative text-center max-w-lg'>
                <div className='w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-6'>
                    <Zap className='w-8 h-8 text-white' />
                </div>
                <h1 className='text-8xl font-extrabold text-white mb-2'>404</h1>
                <p className='text-2xl font-bold text-slate-300 mb-3'>Page Not Found</p>
                <p className='text-slate-500 mb-8'>
                    Looks like this page has gone on a solo ride. Let's get you back on track.
                </p>
                <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                    <Link href='/' className='jv-btn-green'>
                        <ArrowLeft className='w-4 h-4' />
                        Back to Home
                    </Link>
                    <Link
                        href='/shop'
                        className='jv-btn-secondary !border-slate-600 !text-slate-300 hover:!bg-slate-800 hover:!text-white'
                    >
                        Browse Bikes
                    </Link>
                </div>
            </div>
        </div>
    )
}
