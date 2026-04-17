import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SiteSettingsProvider } from '@/components/layout/SiteSettingsProvider'
import { prisma } from '@/lib/prisma'
// app/(account)/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: { default: 'My Account', template: '%s | Jovico Bikes' },
}

async function getSettings() {
    try {
        const rows = await prisma.siteSetting.findMany()
        return Object.fromEntries(rows.map((r) => [r.key, r.value]))
    } catch {
        return {}
    }
}

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
    const settings = await getSettings()
    return (
        <SiteSettingsProvider settings={settings}>
            <div className='flex min-h-screen flex-col'>
                <Navbar />
                <main className='flex-1 py-10 bg-slate-50'>{children}</main>
                <Footer />
            </div>
        </SiteSettingsProvider>
    )
}
