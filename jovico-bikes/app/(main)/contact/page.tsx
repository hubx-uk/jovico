// app/main/contact/page.tsx
import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

import { ContactForm } from '@/components/home/ContactForm'

export const metadata: Metadata = {
    title: 'Contact Us',
    description:
        'Get in touch with the Jovico Bikes team. Visit us on Victoria Island Lagos, call, email or WhatsApp.',
}

export default function ContactPage() {
    return (
        <>
            {/* Hero */}
            <section className='pt-32 pb-16 bg-slate-950'>
                <div className='jv-container'>
                    <p className='text-green-400 font-semibold text-sm uppercase tracking-wider mb-2'>
                        Say Hello
                    </p>
                    <h1 className='text-5xl md:text-6xl font-extrabold text-white mb-4'>
                        Contact Us
                    </h1>
                    <p className='text-slate-400 text-lg max-w-lg'>
                        Whether you want to buy a bike, book a service or just have a question —
                        we're always happy to help.
                    </p>
                </div>
            </section>

            <section className='jv-section bg-white'>
                <div className='jv-container'>
                    <div className='grid lg:grid-cols-2 gap-12 xl:gap-20'>
                        {/* Left: Contact info */}
                        <div>
                            <h2 className='text-3xl font-extrabold text-slate-900 mb-8'>
                                Get in Touch
                            </h2>

                            {/* Quick contact cards */}
                            <div className='space-y-4 mb-10'>
                                {[
                                    {
                                        icon: MessageCircle,
                                        title: 'WhatsApp',
                                        desc: 'The fastest way to reach us',
                                        value: '+234 801 234 5678',
                                        href: 'https://wa.me/2348012345678',
                                        color: 'bg-green-50 text-green-600',
                                        actionLabel: 'Chat Now',
                                    },
                                    {
                                        icon: Phone,
                                        title: 'Phone',
                                        desc: 'Mon–Sat, 9am–6pm',
                                        value: '+234 801 234 5678',
                                        href: 'tel:+2348012345678',
                                        color: 'bg-blue-50 text-blue-600',
                                        actionLabel: 'Call Us',
                                    },
                                    {
                                        icon: Mail,
                                        title: 'Email',
                                        desc: 'We reply within 24 hours',
                                        value: 'hello@jovicobikes.com',
                                        href: 'mailto:hello@jovicobikes.com',
                                        color: 'bg-slate-100 text-slate-700',
                                        actionLabel: 'Send Email',
                                    },
                                ].map((c) => (
                                    <a
                                        key={c.title}
                                        href={c.href}
                                        target={c.href.startsWith('http') ? '_blank' : undefined}
                                        rel='noopener noreferrer'
                                        className='flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group'
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center shrink-0`}
                                        >
                                            <c.icon className='w-6 h-6' />
                                        </div>
                                        <div className='flex-1'>
                                            <div className='text-xs text-slate-500 mb-0.5'>
                                                {c.desc}
                                            </div>
                                            <div className='font-semibold text-slate-900'>
                                                {c.value}
                                            </div>
                                        </div>
                                        <div className='text-sm font-bold text-slate-500 group-hover:text-green-600 transition-colors'>
                                            {c.actionLabel} →
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Address + hours */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                <div className='p-5 rounded-2xl bg-slate-50 border border-slate-100'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <MapPin className='w-5 h-5 text-green-500' />
                                        <h3 className='font-bold text-slate-900 text-sm'>
                                            Our Location
                                        </h3>
                                    </div>
                                    <p className='text-sm text-slate-600 leading-relaxed'>
                                        14 Adeola Odeku Street
                                        <br />
                                        Victoria Island, Lagos
                                        <br />
                                        Nigeria
                                    </p>
                                    <a
                                        href='https://maps.google.com/?q=Victoria+Island+Lagos'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='mt-3 inline-flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700'
                                    >
                                        Get Directions →
                                    </a>
                                </div>
                                <div className='p-5 rounded-2xl bg-slate-50 border border-slate-100'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <Clock className='w-5 h-5 text-green-500' />
                                        <h3 className='font-bold text-slate-900 text-sm'>
                                            Opening Hours
                                        </h3>
                                    </div>
                                    <div className='space-y-1.5 text-sm text-slate-600'>
                                        <div className='flex justify-between'>
                                            <span>Monday – Friday</span>
                                            <span className='font-medium text-slate-900'>
                                                9am – 6pm
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Saturday</span>
                                            <span className='font-medium text-slate-900'>
                                                9am – 4pm
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Sunday</span>
                                            <span className='font-medium text-slate-900'>
                                                By Appointment
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div>
                            <h2 className='text-3xl font-extrabold text-slate-900 mb-8'>
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
