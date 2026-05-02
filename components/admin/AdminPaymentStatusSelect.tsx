'use client'
// components/admin/AdminPaymentStatusSelect.tsx
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const STATUSES = ['UNPAID', 'PAID', 'REFUNDED']

const colors: Record<string, string> = {
    UNPAID: 'text-slate-600 bg-slate-50 border-slate-200',
    PAID: 'text-green-700 bg-green-50 border-green-200',
    REFUNDED: 'text-orange-700 bg-orange-50 border-orange-200',
}

export function AdminPaymentStatusSelect({
    id,
    paymentStatus,
}: {
    id: string
    paymentStatus: string
}) {
    const [local, setLocal] = useState(paymentStatus)
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
                body: JSON.stringify({ paymentStatus: next }),
            })
            if (!res.ok) throw new Error()
            toast.success(`Payment → ${next}`)
            startTransition(() => router.refresh())
        } catch {
            setLocal(prev)
            toast.error('Update failed')
        }
    }

    return (
        <select
            title='status'
            value={local}
            onChange={handleChange}
            disabled={isPending}
            className={`w-full text-sm font-semibold border rounded-xl px-3 py-2.5 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300 ${colors[local] ?? ''}`}
        >
            {STATUSES.map((s) => (
                <option key={s} value={s}>
                    {s}
                </option>
            ))}
        </select>
    )
}
