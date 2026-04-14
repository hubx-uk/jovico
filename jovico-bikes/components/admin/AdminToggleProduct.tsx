'use client'
// components/admin/AdminToggleProduct.tsx
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function AdminToggleProduct({ id, published }: { id: string; published: boolean }) {
    const [isPending, startTransition] = useTransition()
    const [local, setLocal] = useState(published)
    const router = useRouter()

    async function toggle() {
        const next = !local
        setLocal(next)
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: next }),
            })
            if (!res.ok) throw new Error()
            toast.success(next ? 'Product visible' : 'Product hidden')
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
