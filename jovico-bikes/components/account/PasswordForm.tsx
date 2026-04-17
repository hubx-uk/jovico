'use client'
// components/account/PasswordForm.tsx
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function PasswordForm() {
    const [saving, setSaving] = useState(false)
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })

    function set(key: keyof typeof form, value: string) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (form.newPassword !== form.confirm) {
            toast.error('New passwords do not match.')
            return
        }
        if (form.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters.')
            return
        }
        setSaving(true)
        try {
            const res = await fetch('/api/customer/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'change-password',
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            })
            if (!res.ok) {
                const err: { error?: string } = await res.json()
                throw new Error(err.error ?? 'Failed')
            }
            toast.success('Password changed successfully!')
            setForm({ currentPassword: '', newPassword: '', confirm: '' })
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className='bg-white rounded-2xl border border-slate-100 p-5 sm:p-6'>
            <h2 className='font-bold text-slate-900 mb-5'>Change Password</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                {[
                    {
                        key: 'currentPassword' as const,
                        label: 'Current Password',
                        show: showCurrent,
                        toggle: () => setShowCurrent((v) => !v),
                    },
                    {
                        key: 'newPassword' as const,
                        label: 'New Password (min 8 chars)',
                        show: showNew,
                        toggle: () => setShowNew((v) => !v),
                    },
                    {
                        key: 'confirm' as const,
                        label: 'Confirm New Password',
                        show: showNew,
                        toggle: () => setShowNew((v) => !v),
                    },
                ].map(({ key, label, show, toggle }) => (
                    <div key={key}>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            {label}
                        </label>
                        <div className='relative'>
                            <Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                            <input
                                type={show ? 'text' : 'password'}
                                value={form[key]}
                                onChange={(e) => set(key, e.target.value)}
                                required
                                className='jv-input pl-10 pr-10'
                            />
                            <button
                                type='button'
                                onClick={toggle}
                                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                            >
                                {show ? (
                                    <EyeOff className='w-4 h-4' />
                                ) : (
                                    <Eye className='w-4 h-4' />
                                )}
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    type='submit'
                    disabled={saving}
                    className='jv-btn-primary w-full justify-center'
                >
                    {saving ? (
                        <>
                            <Loader2 className='w-4 h-4 animate-spin' /> Updating…
                        </>
                    ) : (
                        'Update Password'
                    )}
                </button>
            </form>
        </div>
    )
}
