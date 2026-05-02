// app/main/privacy/page.tsx
import type { Metadata } from 'next'

import { getSettings } from '@/lib/getSettings'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default async function PrivacyPage() {
    const s = await getSettings(['email', 'phone', 'site_name'])
    return (
        <>
            <section className='pt-28 sm:pt-32 pb-12 bg-slate-950'>
                <div className='jv-container max-w-3xl'>
                    <h1 className='text-4xl font-extrabold text-white mb-3'>Privacy Policy</h1>
                    <p className='text-slate-400'>Last updated: November 2024</p>
                </div>
            </section>
            <section className='jv-section bg-white'>
                <div className='jv-container max-w-3xl prose prose-slate max-w-none'>
                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect information you provide when you make a purchase, book a service,
                        subscribe to our newsletter, or contact us. This includes your name, email
                        address, phone number, and physical address.
                    </p>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use your information to process orders, confirm service bookings, send
                        relevant updates about your purchases, and occasionally send promotional
                        emails (if you have opted in). We never sell your data to third parties.
                    </p>

                    <h2>3. Data Storage</h2>
                    <p>
                        Your data is stored on secure servers hosted by Hostinger in compliance with
                        applicable data protection laws. We retain customer data for a period of 5
                        years for legal and accounting purposes.
                    </p>

                    <h2>4. WhatsApp Communication</h2>
                    <p>
                        By providing your phone number, you consent to receive order-related
                        WhatsApp messages from Jovico Bikes. You can opt out at any time by replying
                        "STOP".
                    </p>

                    <h2>5. Cookies</h2>
                    <p>
                        Our website uses essential cookies to maintain your session and cart. We do
                        not use tracking or advertising cookies.
                    </p>

                    <h2>6. Your Rights</h2>
                    <p>
                        You have the right to request access to your personal data, request deletion
                        of your data, and opt out of marketing communications at any time. Contact
                        us at <a href={`mailto:${s.email}`}>{s.email}</a> to exercise these rights.
                    </p>

                    <h2>7. Contact Us</h2>
                    <p>
                        For any privacy concerns, contact our Data Protection Officer at{' '}
                        <a href={`mailto:${s.email}`}>{s.email}</a> or call {s.phone}.
                    </p>
                </div>
            </section>
        </>
    )
}
