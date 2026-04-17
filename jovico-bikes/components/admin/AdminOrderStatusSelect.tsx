'use client'
import { useRouter } from 'next/navigation'
// components/admin/AdminOrderStatusSelect.tsx
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const colors: Record<string, string> = {
    PENDING: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    PROCESSING: 'text-blue-700 bg-blue-50 border-blue-200',
    SHIPPED: 'text-purple-700 bg-purple-50 border-purple-200',
    DELIVERED: 'text-green-700 bg-green-50 border-green-200',
    CANCELLED: 'text-red-700 bg-red-50 border-red-200',
}

export function AdminOrderStatusSelect({
    id,
    status,
    fullWidth = false,
}: {
    id: string
    status: string
    fullWidth?: boolean
}) {
    const [local, setLocal] = useState(status)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const next = e.target.value
        const prev = local
        setLocal(next)
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: next }),
            })
            if (!res.ok) throw new Error()
            toast.success(`Order status → ${next}`)
            startTransition(() => router.refresh())
        } catch {
            setLocal(prev)
            toast.error('Status update failed')
        }
    }

    return (
        <select
            value={local}
            onChange={handleChange}
            disabled={isPending}
            className={`${fullWidth ? 'w-full' : ''} text-xs font-semibold border rounded-xl px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 ${colors[local] ?? ''}`}
        >
            {STATUSES.map((s) => (
                <option key={s} value={s}>
                    {s}
                </option>
            ))}
        </select>
    )
}
