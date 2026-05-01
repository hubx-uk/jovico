// lib/getSettings.ts
// Server-side helper: fetches site settings and returns typed defaults.
// Use this in any server component that needs contact details but is outside
// the (main) layout (and therefore can't use SiteSettingsProvider/useSiteSettings).
import { prisma } from './prisma'

export interface Settings {
    site_name: string
    tagline: string
    phone: string
    email: string
    address: string
    whatsapp: string
    instagram: string
    twitter: string
    facebook: string
    hero_video_url: string
    hero_video_poster: string
    hero_video_title: string
    hero_video_subtitle: string
}

const DEFAULTS: Settings = {
    site_name: 'Jovico Bikes',
    tagline: 'Ride Electric. Ride Lagos.',
    phone: '+234 801 234 5678',
    email: 'hello@jovicobikes.com',
    address: '14 Adeola Odeku Street, Victoria Island, Lagos',
    whatsapp: '+2348012345678',
    instagram: 'https://instagram.com/jovicobikes',
    twitter: 'https://twitter.com/jovicobikes',
    facebook: 'https://facebook.com/jovicobikes',
    hero_video_url: '',
    hero_video_poster: '',
    hero_video_title: 'Feel the Electric Difference',
    hero_video_subtitle: 'See what riding a Jovico eBike through Lagos truly feels like.',
}

export async function getSettings(keys?: (keyof Settings)[]): Promise<Settings> {
    try {
        const rows = await prisma.siteSetting.findMany(
            keys ? { where: { key: { in: keys } } } : undefined
        )
        const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
        return { ...DEFAULTS, ...map } as Settings
    } catch {
        return DEFAULTS
    }
}

/** Returns just the whatsapp number digits, ready for wa.me/ links */
export function waNumber(settings: Settings): string {
    return settings.whatsapp.replace(/\D/g, '')
}
