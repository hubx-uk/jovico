'use client'
// components/admin/AdminCustomerActions.tsx
import { Trash2, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    customerId: string
    customerName: string
    isDeleted: boolean
}

type ActionState = 'idle' | 'confirm-soft' | 'confirm-hard' | 'loading'

export function AdminCustomerActions({ customerId, customerName, isDeleted }: Props) {
    const [state, setState] = useState<ActionState>('idle')
    const router = useRouter()

    async function handleSoftDelete() {
        setState('loading')
        try {
            const res = await fetch(`/api/admin/customers/${customerId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
            toast.success(`${customerName} has been soft-deleted. They can no longer log in.`)
            router.refresh()
        } catch {
            toast.error('Failed to delete. Please try again.')
        } finally {
            setState('idle')
        }
    }

    async function handleRestore() {
        setState('loading')
        try {
            const res = await fetch(`/api/admin/customers/${customerId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'restore' }),
            })
            if (!res.ok) throw new Error()
            toast.success(`${customerName}'s account has been restored.`)
            router.refresh()
        } catch {
            toast.error('Failed to restore. Please try again.')
        } finally {
            setState('idle')
        }
    }

    async function handleHardDelete() {
        setState('loading')
        try {
            const res = await fetch(`/api/admin/customers/${customerId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'hard-delete' }),
            })
            if (!res.ok) throw new Error()
            toast.success(`${customerName} permanently removed. Orders retained for accounting.`)
            router.push('/admin/customers')
        } catch {
            toast.error('Failed to permanently delete. Please try again.')
        } finally {
            setState('idle')
        }
    }

    if (state === 'loading') {
        return (
            <div className='bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-center gap-2 text-slate-500 text-sm'>
                <Loader2 className='w-4 h-4 animate-spin' /> Processing…
            </div>
        )
    }

    if (state === 'confirm-soft') {
        return (
            <div className='bg-orange-50 border border-orange-200 rounded-2xl p-5 space-y-4'>
                <div className='flex items-start gap-3'>
                    <AlertTriangle className='w-5 h-5 text-orange-500 shrink-0 mt-0.5' />
                    <div>
                        <p className='font-semibold text-orange-800 text-sm'>
                            Soft-delete this account?
                        </p>
                        <p className='text-xs text-orange-600 mt-1'>
                            {customerName} will be locked out but their data and order history are
                            preserved. You can restore this account at any time.
                        </p>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <button
                        type='button'
                        onClick={() => setState('idle')}
                        className='flex-1 px-3 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={handleSoftDelete}
                        className='flex-1 px-3 py-2 rounded-xl text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors'
                    >
                        Yes, Disable Account
                    </button>
                </div>
            </div>
        )
    }

    if (state === 'confirm-hard') {
        return (
            <div className='bg-red-50 border border-red-200 rounded-2xl p-5 space-y-4'>
                <div className='flex items-start gap-3'>
                    <AlertTriangle className='w-5 h-5 text-red-500 shrink-0 mt-0.5' />
                    <div>
                        <p className='font-semibold text-red-800 text-sm'>Permanently delete?</p>
                        <p className='text-xs text-red-600 mt-1'>
                            This will permanently remove all of {customerName}&apos;s personal data.
                            Their order records are retained for accounting.{' '}
                            <strong>This cannot be undone.</strong>
                        </p>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <button
                        type='button'
                        onClick={() => setState('idle')}
                        className='flex-1 px-3 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={handleHardDelete}
                        className='flex-1 px-3 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors'
                    >
                        Delete Permanently
                    </button>
                </div>
            </div>
        )
    }

    // Idle state
    return (
        <div className='bg-white rounded-2xl border border-slate-100 p-5 space-y-3'>
            <h2 className='font-bold text-slate-900 text-sm'>Account Actions</h2>

            {isDeleted ? (
                <>
                    {/* Restore */}
                    <button
                        type='button'
                        onClick={handleRestore}
                        className='flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors'
                    >
                        <RotateCcw className='w-4 h-4 shrink-0' />
                        Restore Account
                    </button>
                    <p className='text-xs text-slate-400 leading-relaxed'>
                        Restoring will allow this customer to log in again with their existing
                        credentials.
                    </p>
                    {/* Hard delete (only available when already soft-deleted) */}
                    <div className='pt-2 border-t border-slate-100'>
                        <button
                            type='button'
                            onClick={() => setState('confirm-hard')}
                            className='flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors'
                        >
                            <Trash2 className='w-4 h-4 shrink-0' />
                            Permanently Delete
                        </button>
                        <p className='text-xs text-slate-400 mt-2 leading-relaxed'>
                            Permanently removes all personal data. Order records are kept for legal
                            purposes.
                        </p>
                    </div>
                </>
            ) : (
                <>
                    {/* Soft delete */}
                    <button
                        type='button'
                        onClick={() => setState('confirm-soft')}
                        className='flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-sm font-semibold hover:bg-orange-100 transition-colors'
                    >
                        <Trash2 className='w-4 h-4 shrink-0' />
                        Disable Account
                    </button>
                    <p className='text-xs text-slate-400 leading-relaxed'>
                        Disabling locks the customer out but preserves all their data and order
                        history. You can re-enable it at any time.
                    </p>
                </>
            )}
        </div>
    )
}
