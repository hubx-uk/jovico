import { ContactForm } from '@/components/home/ContactForm'
import { prisma } from '@/lib/prisma'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
// app/(main)/contact/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Us',
    description:
        'Get in touch with the Jovico Bikes team. Visit us on Victoria Island Lagos, call, email or WhatsApp.',
}

async function getContactSettings() {
    try {
        const rows = await prisma.siteSetting.findMany({
            where: { key: { in: ['phone', 'email', 'address', 'whatsapp'] } },
        })
        return Object.fromEntries(rows.map((r) => [r.key, r.value]))
    } catch {
        return {
            phone: '+234 801 234 5678',
            email: 'hello@jovicobikes.com',
            address: '14 Adeola Odeku Street, Victoria Island, Lagos',
            whatsapp: '+2348012345678',
        }
    }
}

export default async function ContactPage() {
    const s = await getContactSettings()
    const phone = s.phone ?? '+234 801 234 5678'
    const email = s.email ?? 'hello@jovicobikes.com'
    const address = s.address ?? '14 Adeola Odeku Street, Victoria Island, Lagos'
    const waNumber = (s.whatsapp ?? '+2348012345678').replace(/\D/g, '')

    return (
        <>
            <section className='pt-28 sm:pt-32 pb-14 bg-slate-950'>
                <div className='jv-container'>
                    <p className='text-green-400 font-semibold text-sm uppercase tracking-wider mb-2'>
                        Say Hello
                    </p>
                    <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4'>
                        Contact Us
                    </h1>
                    <p className='text-slate-400 text-base md:text-lg max-w-lg leading-relaxed'>
                        Whether you want to buy a bike, book a service, or just have a question —
                        we&apos;re always happy to help.
                    </p>
                </div>
            </section>

            <section className='jv-section bg-white'>
                <div className='jv-container'>
                    <div className='grid lg:grid-cols-2 gap-10 xl:gap-16'>
                        <div>
                            <h2 className='text-2xl md:text-3xl font-extrabold text-slate-900 mb-7'>
                                Get in Touch
                            </h2>
                            <div className='space-y-3 mb-8'>
                                {[
                                    {
                                        icon: MessageCircle,
                                        title: 'WhatsApp',
                                        desc: 'Fastest — usually within minutes',
                                        value: phone,
                                        href: `https://wa.me/${waNumber}`,
                                        color: 'bg-green-50 text-green-600',
                                        action: 'Chat Now',
                                    },
                                    {
                                        icon: Phone,
                                        title: 'Phone',
                                        desc: 'Mon–Sat, 9am–6pm',
                                        value: phone,
                                        href: `tel:${phone.replace(/\s/g, '')}`,
                                        color: 'bg-blue-50 text-blue-600',
                                        action: 'Call Us',
                                    },
                                    {
                                        icon: Mail,
                                        title: 'Email',
                                        desc: 'We reply within 24 hours',
                                        value: email,
                                        href: `mailto:${email}`,
                                        color: 'bg-slate-100 text-slate-700',
                                        action: 'Send Email',
                                    },
                                ].map((c) => (
                                    <a
                                        key={c.title}
                                        href={c.href}
                                        target={c.href.startsWith('http') ? '_blank' : undefined}
                                        rel='noopener noreferrer'
                                        className='flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group'
                                    >
                                        <div
                                            className={`w-11 h-11 rounded-2xl ${c.color} flex items-center justify-center shrink-0`}
                                        >
                                            <c.icon className='w-5 h-5' />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div className='text-[11px] text-slate-400 mb-0.5'>
                                                {c.desc}
                                            </div>
                                            <div className='font-semibold text-slate-900 text-sm truncate'>
                                                {c.value}
                                            </div>
                                        </div>
                                        <span className='hidden sm:block text-sm font-bold text-slate-400 group-hover:text-green-600 transition-colors shrink-0'>
                                            {c.action} →
                                        </span>
                                    </a>
                                ))}
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className='p-5 rounded-2xl bg-slate-50 border border-slate-100'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <MapPin className='w-4 h-4 text-green-500 shrink-0' />
                                        <h3 className='font-bold text-slate-900 text-sm'>
                                            Location
                                        </h3>
                                    </div>
                                    <p className='text-sm text-slate-600 leading-relaxed'>
                                        {address}
                                    </p>
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='mt-3 inline-flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700'
                                    >
                                        Get Directions →
                                    </a>
                                </div>
                                <div className='p-5 rounded-2xl bg-slate-50 border border-slate-100'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <Clock className='w-4 h-4 text-green-500 shrink-0' />
                                        <h3 className='font-bold text-slate-900 text-sm'>
                                            Opening Hours
                                        </h3>
                                    </div>
                                    <div className='space-y-1.5 text-sm text-slate-600'>
                                        {[
                                            ['Mon – Fri', '9am – 6pm'],
                                            ['Saturday', '9am – 4pm'],
                                            ['Sunday', 'By Appointment'],
                                        ].map(([day, time]) => (
                                            <div key={day} className='flex justify-between gap-2'>
                                                <span>{day}</span>
                                                <span className='font-semibold text-slate-900 shrink-0'>
                                                    {time}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className='text-2xl md:text-3xl font-extrabold text-slate-900 mb-7'>
                                Send a Message
                            </h2>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
