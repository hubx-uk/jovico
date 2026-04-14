'use client'
// components/admin/AdminLoginForm.tsx
import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'

export function AdminLoginForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const form = new FormData(e.currentTarget)
        const email = form.get('email') as string
        const password = form.get('password') as string

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                const data = await res.json()
                toast.error(data.error ?? 'Login failed')
                return
            }

            toast.success('Welcome back!')
            router.push('/admin')
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label className='block text-sm font-semibold text-slate-300 mb-1.5'>
                    Email Address
                </label>
                <div className='relative'>
                    <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
                    <input
                        type='email'
                        name='email'
                        required
                        placeholder='admin@jovicobikes.com'
                        className='w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition'
                    />
                </div>
            </div>

            <div>
                <label className='block text-sm font-semibold text-slate-300 mb-1.5'>
                    Password
                </label>
                <div className='relative'>
                    <Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
                    <input
                        type={showPass ? 'text' : 'password'}
                        name='password'
                        required
                        placeholder='••••••••'
                        className='w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 rounded-2xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition'
                    />
                    <button
                        type='button'
                        onClick={() => setShowPass(!showPass)}
                        className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors'
                    >
                        {showPass ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                    </button>
                </div>
            </div>

            <button
                type='submit'
                disabled={loading}
                className='w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm'
            >
                {loading ? (
                    <>
                        <Loader2 className='w-4 h-4 animate-spin' /> Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>
        </form>
    )
}
