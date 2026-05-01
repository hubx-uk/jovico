// app/layout.tsx
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'

import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        default: 'Jovico Bikes — Premium eBikes in Lagos, Nigeria',
        template: '%s | Jovico Bikes',
    },
    description:
        "Lagos's premier eBike retailer and service centre. Shop the finest electric bikes, accessories, and expert servicing. Ride electric. Ride Lagos.",
    keywords: [
        'ebike Lagos',
        'electric bicycle Nigeria',
        'ebike shop Lagos',
        'Jovico bikes',
        'electric bike service Lagos',
        'buy ebike Nigeria',
    ],
    metadataBase: new URL('https://jovicoworld.com'),
    alternates: {
        canonical: '/',
        languages: {
            'en-US': '/en-US',
        },
    },
    authors: [{ name: 'Jovico Bikes', url: 'https://jovicoworld.com' }],
    creator: 'Jovico Bikes',
    openGraph: {
        type: 'website',
        locale: 'en_NG',
        url: 'https://jovicoworld.com',
        siteName: 'Jovico Bikes',
        title: 'Jovico Bikes — Premium eBikes in Lagos, Nigeria',
        description: "Lagos's premier eBike retailer and service centre.",
        images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Jovico Bikes — Premium eBikes in Lagos',
        description: "Lagos's premier eBike retailer and service centre.",
        creator: '@jovicobikes',
    },
    robots: { index: true, follow: true },
    icons: {
        icon: '/images/favicon.ico',
        shortcut: '/images/favicon.ico',
        apple: '/images/apple-icon.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                {children}
                <Toaster
                    position='top-right'
                    toastOptions={{
                        style: {
                            borderRadius: '16px',
                            fontFamily: 'var(--font-inter)',
                        },
                    }}
                />
            </body>
        </html>
    )
}
