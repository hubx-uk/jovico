'use client'
import { CheckCircle2, Info, Loader2, Save } from 'lucide-react'
// components/admin/AdminSettingsForm.tsx
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    settings: Record<string, string>
}

const CONTACT_FIELDS = [
    {
        key: 'site_name',
        label: 'Site Name',
        type: 'text',
        placeholder: 'Jovico Bikes',
        hint: 'Appears in page titles, footer and emails',
    },
    {
        key: 'tagline',
        label: 'Tagline',
        type: 'text',
        placeholder: 'Ride Electric. Ride Lagos.',
        hint: 'Short description shown in the footer newsletter section',
    },
    {
        key: 'phone',
        label: 'Phone Number',
        type: 'text',
        placeholder: '+234 801 234 5678',
        hint: 'Shown on Contact page and footer',
    },
    {
        key: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'hello@jovicoworld.com',
        hint: 'Shown on Contact page and footer',
    },
    {
        key: 'address',
        label: 'Physical Address',
        type: 'text',
        placeholder: '14 Adeola Odeku, Victoria Island, Lagos',
        hint: 'Shown on Contact and About pages',
    },
]

const SOCIAL_FIELDS = [
    {
        key: 'whatsapp',
        label: 'WhatsApp Number',
        type: 'text',
        placeholder: '+2348012345678',
        hint: 'Full number with country code, no spaces. Used for the floating chat button.',
    },
    {
        key: 'instagram',
        label: 'Instagram URL',
        type: 'url',
        placeholder: 'https://instagram.com/jovicobikes',
        hint: '',
    },
    {
        key: 'twitter',
        label: 'Twitter / X URL',
        type: 'url',
        placeholder: 'https://twitter.com/jovicobikes',
        hint: '',
    },
    {
        key: 'facebook',
        label: 'Facebook URL',
        type: 'url',
        placeholder: 'https://facebook.com/jovicobikes',
        hint: '',
    },
]

const VIDEO_FIELDS = [
    {
        key: 'hero_video_url',
        label: 'Homepage Video URL (.mp4 or YouTube embed URL)',
        type: 'url',
        placeholder: 'https://example.com/ride-video.mp4',
        hint: 'The looping video shown on the homepage after the hero. Use a direct .mp4 link or leave blank to hide the section.',
    },
    {
        key: 'hero_video_poster',
        label: 'Video Poster Image URL (optional)',
        type: 'url',
        placeholder: 'https://example.com/poster.jpg',
        hint: 'Thumbnail image shown before the video loads.',
    },
    {
        key: 'hero_video_title',
        label: 'Video Section Title',
        type: 'text',
        placeholder: 'Feel the Electric Difference',
        hint: '',
    },
    {
        key: 'hero_video_subtitle',
        label: 'Video Section Subtitle',
        type: 'text',
        placeholder: 'See what riding a Jovico eBike through Lagos truly feels like.',
        hint: '',
    },
]

export function AdminSettingsForm({ settings }: Props) {
    const [form, setForm] = useState<Record<string, string>>(settings)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    function set(key: string, value: string) {
        setSaved(false)
        setForm((f) => ({ ...f, [key]: value }))
    }

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
            setSaved(true)
            toast.success('Settings saved! All public pages updated instantly.')
        } catch {
            toast.error('Failed to save settings. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const renderField = (field: {
        key: string
        label: string
        type: string
        placeholder: string
        hint: string
    }) => (
        <div key={field.key}>
            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                {field.label}
            </label>
            <input
                type={field.type}
                value={form[field.key] ?? ''}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                className='jv-input'
            />
            {field.hint && (
                <p className='text-xs text-slate-400 mt-1 flex items-start gap-1.5'>
                    <Info className='w-3 h-3 mt-0.5 shrink-0' />
                    {field.hint}
                </p>
            )}
        </div>
    )

    return (
        <form onSubmit={handleSave} className='space-y-5'>
            {/* Info banner */}
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3'>
                <Info className='w-4 h-4 text-blue-500 mt-0.5 shrink-0' />
                <div className='text-sm text-blue-700 leading-relaxed'>
                    <strong>Settings are live site-wide.</strong> Changes to phone, email, address
                    and WhatsApp number appear immediately on the Contact page, About page, and
                    Footer — no rebuild needed.
                </div>
            </div>

            {/* Contact info */}
            <div className='bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 space-y-5'>
                <h2 className='font-bold text-slate-900'>Contact Information</h2>
                {CONTACT_FIELDS.map(renderField)}
            </div>

            {/* Social & WhatsApp */}
            <div className='bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 space-y-5'>
                <h2 className='font-bold text-slate-900'>Social Media & WhatsApp</h2>
                {SOCIAL_FIELDS.map(renderField)}
            </div>

            {/* Homepage Video */}
            <div className='bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 space-y-5'>
                <div>
                    <h2 className='font-bold text-slate-900'>Homepage Video Section</h2>
                    <p className='text-xs text-slate-400 mt-1'>
                        The looping video panel shown on the homepage. Leave the URL blank to hide
                        the section entirely.
                    </p>
                </div>
                {VIDEO_FIELDS.map(renderField)}
            </div>

            {/* Save button */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                <button
                    type='submit'
                    disabled={saving}
                    className='jv-btn-primary w-full sm:w-auto justify-center text-base !py-4 !px-10'
                >
                    {saving ? (
                        <>
                            <Loader2 className='w-5 h-5 animate-spin' /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className='w-5 h-5' /> Save All Settings
                        </>
                    )}
                </button>
                {saved && (
                    <div className='flex items-center gap-2 text-sm text-green-600 font-medium'>
                        <CheckCircle2 className='w-4 h-4' />
                        Saved — site updated
                    </div>
                )}
            </div>
        </form>
    )
}
