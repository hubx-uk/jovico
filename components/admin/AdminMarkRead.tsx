'use client'
// components/admin/AdminMarkRead.tsx
import { useRouter } from 'next/navigation'
import { CheckCheck } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

export function AdminMarkRead({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    async function markRead() {
        try {
            const res = await fetch(`/api/contact/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true }),
            })
            if (!res.ok) throw new Error()
            toast.success('Marked as read')
            startTransition(() => router.refresh())
        } catch {
            toast.error('Failed to update')
        }
    }

    return (
        <button
            type='button'
            onClick={markRead}
            disabled={isPending}
            className='px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1'
        >
            <CheckCheck className='w-3.5 h-3.5' />
            Read
        </button>
    )
}
