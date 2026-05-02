'use client'
// components/account/CancelOrderButton.tsx
import { XCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function CancelOrderButton({ orderId }: { orderId: string }) {
    const [confirming, setConfirming] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleCancel() {
        setLoading(true)
        try {
            const res = await fetch(`/api/customer/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'cancel' }),
            })
            if (!res.ok) {
                const err: { error?: string } = await res.json()
                throw new Error(err.error ?? 'Failed to cancel')
            }
            toast.success('Order cancelled successfully.')
            router.refresh()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
            setConfirming(false)
        }
    }

    if (confirming) {
        return (
            <div className='bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3'>
                <p className='text-sm font-semibold text-red-700'>Cancel this order?</p>
                <p className='text-xs text-red-600'>
                    This action cannot be undone. Contact us if you need help.
                </p>
                <div className='flex gap-2'>
                    <button
                        type='button'
                        onClick={() => setConfirming(false)}
                        className='flex-1 px-3 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors'
                    >
                        Keep Order
                    </button>
                    <button
                        type='button'
                        onClick={handleCancel}
                        disabled={loading}
                        className='flex-1 px-3 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5'
                    >
                        {loading ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                            <XCircle className='w-4 h-4' />
                        )}
                        Yes, Cancel
                    </button>
                </div>
            </div>
        )
    }

    return (
        <button
            type='button'
            onClick={() => setConfirming(true)}
            className='flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100'
        >
            <XCircle className='w-4 h-4' />
            Cancel Order
        </button>
    )
}
