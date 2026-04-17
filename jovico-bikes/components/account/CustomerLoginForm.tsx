'use client'
// components/account/CustomerLoginForm.tsx
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    mode: 'login' | 'register'
}

export function CustomerLoginForm({ mode }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const from = searchParams.get('from') ?? '/account'

    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirm: '',
    })

    function set(key: keyof typeof form, value: string) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (mode === 'register' && form.password !== form.confirm) {
            toast.error('Passwords do not match.')
            return
        }
        if (mode === 'register' && form.password.length < 8) {
            toast.error('Password must be at least 8 characters.')
            return
        }

        setLoading(true)
        try {
            const payload =
                mode === 'login'
                    ? { action: 'login', email: form.email, password: form.password }
                    : {
                          action: 'register',
                          name: form.name,
                          email: form.email,
                          phone: form.phone || undefined,
                          password: form.password,
                      }

            const res = await fetch('/api/customer/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const err: { error?: string } = await res.json()
                throw new Error(err.error ?? 'Authentication failed')
            }

            toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!')
            router.push(from.startsWith('/account') ? from : '/account')
            router.refresh()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            {mode === 'register' && (
                <>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Full Name
                        </label>
                        <div className='relative'>
                            <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                            <input
                                type='text'
                                value={form.name}
                                onChange={(e) => set('name', e.target.value)}
                                required
                                placeholder='Emeka Okafor'
                                className='jv-input pl-10'
                            />
                        </div>
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            Phone (optional)
                        </label>
                        <div className='relative'>
                            <Phone className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                            <input
                                type='tel'
                                value={form.phone}
                                onChange={(e) => set('phone', e.target.value)}
                                placeholder='+234 801 234 5678'
                                className='jv-input pl-10'
                            />
                        </div>
                    </div>
                </>
            )}

            <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                    Email Address
                </label>
                <div className='relative'>
                    <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                    <input
                        type='email'
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        required
                        placeholder='you@email.com'
                        className='jv-input pl-10'
                        autoComplete={mode === 'login' ? 'email' : 'new-email'}
                    />
                </div>
            </div>

            <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                    {mode === 'register' ? 'Password (min 8 chars)' : 'Password'}
                </label>
                <div className='relative'>
                    <Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                    <input
                        type={showPass ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => set('password', e.target.value)}
                        required
                        placeholder='••••••••'
                        className='jv-input pl-10 pr-11'
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                    <button
                        type='button'
                        onClick={() => setShowPass((v) => !v)}
                        className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
                        aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                        {showPass ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                    </button>
                </div>
            </div>

            {mode === 'register' && (
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                        Confirm Password
                    </label>
                    <div className='relative'>
                        <Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                        <input
                            type={showPass ? 'text' : 'password'}
                            value={form.confirm}
                            onChange={(e) => set('confirm', e.target.value)}
                            required
                            placeholder='••••••••'
                            className='jv-input pl-10'
                            autoComplete='new-password'
                        />
                    </div>
                </div>
            )}

            <button
                type='submit'
                disabled={loading}
                className='jv-btn-primary w-full justify-center text-base !py-3.5 mt-2'
            >
                {loading ? (
                    <>
                        <Loader2 className='w-4 h-4 animate-spin' />{' '}
                        {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                    </>
                ) : mode === 'login' ? (
                    'Sign In'
                ) : (
                    'Create Account'
                )}
            </button>
        </form>
    )
}
