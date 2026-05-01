// app/(main)/layout.tsx
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SiteSettingsProvider } from '@/components/layout/SiteSettingsProvider'

async function getSettings() {
    try {
        const rows = await prisma.siteSetting.findMany()
        return Object.fromEntries(rows.map((r) => [r.key, r.value]))
    } catch {
        return {}
    }
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const settings = await getSettings()

    return (
        <SiteSettingsProvider settings={settings}>
            <div className='flex min-h-screen flex-col'>
                <Navbar />
                <main className='flex-1'>{children}</main>
                <Footer />
            </div>
        </SiteSettingsProvider>
    )
}
