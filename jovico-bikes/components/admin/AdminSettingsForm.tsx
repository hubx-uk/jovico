'use client'
// components/admin/AdminSettingsForm.tsx
import { useState } from 'react'
import { toast } from 'sonner'
import { Save, Loader2 } from 'lucide-react'

interface Props {
    settings: Record<string, string>
}

const FIELDS = [
    { key: 'site_name', label: 'Site Name', type: 'text', placeholder: 'Jovico Bikes' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Ride Electric. Ride Lagos.' },
    { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+234 801 234 5678' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'hello@jovicobikes.com' },
    {
        key: 'address',
        label: 'Physical Address',
        type: 'text',
        placeholder: '14 Adeola Odeku, VI Lagos',
    },
    {
        key: 'whatsapp',
        label: 'WhatsApp Number (no spaces, include country code)',
        type: 'text',
        placeholder: '+2348012345678',
    },
    {
        key: 'instagram',
        label: 'Instagram URL',
        type: 'url',
        placeholder: 'https://instagram.com/jovicobikes',
    },
    {
        key: 'twitter',
        label: 'Twitter URL',
        type: 'url',
        placeholder: 'https://twitter.com/jovicobikes',
    },
    {
        key: 'facebook',
        label: 'Facebook URL',
        type: 'url',
        placeholder: 'https://facebook.com/jovicobikes',
    },
]

export function AdminSettingsForm({ settings }: Props) {
    const [form, setForm] = useState<Record<string, string>>(settings)
    const [saving, setSaving] = useState(false)

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (!res.ok) throw new Error()
            toast.success('Settings saved!')
        } catch {
            toast.error('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSave} className='space-y-5'>
            <div className='bg-white rounded-2xl border border-slate-100 p-6 space-y-5'>
                <h2 className='font-bold text-slate-900'>Contact Information</h2>
                {FIELDS.slice(0, 5).map((field) => (
                    <div key={field.key}>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            value={form[field.key] ?? ''}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, [field.key]: e.target.value }))
                            }
                            placeholder={field.placeholder}
                            className='jv-input'
                        />
                    </div>
                ))}
            </div>

            <div className='bg-white rounded-2xl border border-slate-100 p-6 space-y-5'>
                <h2 className='font-bold text-slate-900'>Social & WhatsApp</h2>
                {FIELDS.slice(5).map((field) => (
                    <div key={field.key}>
                        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            value={form[field.key] ?? ''}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, [field.key]: e.target.value }))
                            }
                            placeholder={field.placeholder}
                            className='jv-input'
                        />
                    </div>
                ))}
            </div>

            <button
                type='submit'
                disabled={saving}
                className='jv-btn-primary w-full justify-center text-base !py-4'
            >
                {saving ? (
                    <>
                        <Loader2 className='w-5 h-5 animate-spin' /> Saving...
                    </>
                ) : (
                    <>
                        <Save className='w-5 h-5' /> Save Settings
                    </>
                )}
            </button>
        </form>
    )
}
