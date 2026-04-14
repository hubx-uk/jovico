'use client'
import { useRouter } from 'next/navigation'
// components/admin/AdminToggleService.tsx
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export function AdminToggleService({ id, published }: { id: string; published: boolean }) {
    const [local, setLocal] = useState(published)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    async function toggle() {
        const next = !local
        setLocal(next)
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: next }),
            })
            if (!res.ok) throw new Error()
            toast.success(next ? 'Service visible' : 'Service hidden')
            startTransition(() => router.refresh())
        } catch {
            setLocal(!next)
            toast.error('Update failed')
        }
    }

    return (
        <button
            type='button'
            onClick={toggle}
            disabled={isPending}
            className={`jv-badge text-xs font-semibold cursor-pointer transition-colors ${
                local
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
        >
            {local ? '● Active' : '○ Hidden'}
        </button>
    )
}
