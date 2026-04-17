'use client'
import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
// components/account/DeleteAccountButton.tsx
import { useState } from 'react'
import { toast } from 'sonner'

export function DeleteAccountButton() {
    const [confirming, setConfirming] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        setDeleting(true)
        try {
            const res = await fetch('/api/customer/profile', { method: 'DELETE' })
            if (!res.ok) throw new Error()
            toast.success("Account deleted. We're sorry to see you go!")
            router.push('/')
            router.refresh()
        } catch {
            toast.error('Failed to delete account. Please contact support.')
        } finally {
            setDeleting(false)
            setConfirming(false)
        }
    }

    if (confirming) {
        return (
            <div className='space-y-3'>
                <p className='text-sm font-semibold text-red-800'>
                    Are you absolutely sure? This cannot be undone.
                </p>
                <div className='flex gap-3'>
                    <button
                        type='button'
                        onClick={() => setConfirming(false)}
                        className='flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={handleDelete}
                        disabled={deleting}
                        className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60'
                    >
                        {deleting ? (
                            <>
                                <Loader2 className='w-4 h-4 animate-spin' /> Deleting…
                            </>
                        ) : (
                            'Yes, Delete My Account'
                        )}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <button
            type='button'
            onClick={() => setConfirming(true)}
            className='flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-300 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors'
        >
            <Trash2 className='w-4 h-4' />
            Delete My Account
        </button>
    )
}
