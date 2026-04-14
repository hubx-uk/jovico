'use client'
import { useRouter } from 'next/navigation'
// components/admin/AdminBookingStatus.tsx
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
const colors: Record<string, string> = {
    PENDING: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    CONFIRMED: 'text-blue-700 bg-blue-50 border-blue-200',
    COMPLETED: 'text-green-700 bg-green-50 border-green-200',
    CANCELLED: 'text-red-700 bg-red-50 border-red-200',
}

export function AdminBookingStatus({ id, status }: { id: string; status: string }) {
    const [local, setLocal] = useState(status)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const next = e.target.value
        const prev = local
        setLocal(next)
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: next }),
            })
            if (!res.ok) throw new Error()
            toast.success(`Booking → ${next}`)
            startTransition(() => router.refresh())
        } catch {
            setLocal(prev)
            toast.error('Update failed')
        }
    }

    return (
        <select
            value={local}
            onChange={handleChange}
            disabled={isPending}
            className={`text-xs font-semibold border rounded-xl px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 ${colors[local] ?? ''}`}
        >
            {STATUSES.map((s) => (
                <option key={s} value={s}>
                    {s}
                </option>
            ))}
        </select>
    )
}
