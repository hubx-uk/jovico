// app/(main)/about/page.tsx
import { ArrowRight, MapPin, Users, Award, Leaf, Zap, Heart, Target } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
    title: 'About Us',
    description:
        "Learn about Jovico Bikes — Lagos's homegrown eBike company on a mission to transform urban mobility in Nigeria.",
}

async function getAddress() {
    try {
        const row = await prisma.siteSetting.findUnique({ where: { key: 'address' } })
        return row?.value ?? '14 Adeola Odeku Street, Victoria Island, Lagos'
    } catch {
        return '14 Adeola Odeku Street, Victoria Island, Lagos'
    }
}

export default async function AboutPage() {
    const address = await getAddress()

    return (
        <>
            {/* Hero */}
            <section className='pt-28 sm:pt-32 pb-16 sm:pb-20 bg-slate-950 relative overflow-hidden'>
                <div
                    className='absolute inset-0 opacity-[0.03] pointer-events-none'
                    style={{
                        backgroundImage:
                            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[600px] h-72 sm:h-[600px] rounded-full bg-green-500/5 blur-3xl pointer-events-none' />
                <div className='jv-container relative z-10'>
                    <p className='text-green-400 font-semibold text-sm uppercase tracking-wider mb-3'>
                        Our Story
                    </p>
                    <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 sm:mb-6 max-w-3xl leading-tight'>
                        Born in Lagos.
                        <br />
                        <span className='text-green-400'>Built for Lagos.</span>
                    </h1>
                    <p className='text-slate-400 text-base md:text-xl leading-relaxed max-w-2xl'>
                        Jovico Bikes was founded with one simple belief: electric mobility can
                        transform how millions of Lagosians move through their city — cleaner,
                        faster, and more affordably.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className='jv-section bg-white'>
                <div className='jv-container'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center'>
                        <div>
                            <p className='text-green-500 font-semibold text-sm uppercase tracking-wider mb-3'>
                                Our Mission
                            </p>
                            <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5'>
                                Making Electric Mobility Accessible to Every Nigerian
                            </h2>
                            <p className='text-slate-600 leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base'>
                                We started Jovico Bikes after one too many hours trapped in Lagos
                                gridlock, watching fuel money evaporate. We knew there had to be a
                                better way — and that better way was electric.
                            </p>
                            <p className='text-slate-600 leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base'>
                                Since then we&apos;ve helped over 500 Lagosians switch to eBikes.
                                We&apos;ve built a workshop capable of servicing every major eBike
                                platform. And we&apos;ve become the most trusted name in Nigerian
                                electric mobility.
                            </p>
                            <p className='text-slate-600 leading-relaxed mb-7 sm:mb-8 text-sm sm:text-base'>
                                Our vision: a Lagos where every commuter, every delivery rider,
                                every weekend adventurer can access affordable, reliable electric
                                transport.
                            </p>
                            <Link href='/contact' className='jv-btn-primary'>
                                Get in Touch <ArrowRight className='w-4 h-4' />
                            </Link>
                        </div>

                        {/* Stats grid */}
                        <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                            {[
                                {
                                    icon: Users,
                                    value: '500+',
                                    label: 'Happy Riders',
                                    color: 'bg-blue-50 text-blue-600',
                                },
                                {
                                    icon: Award,
                                    value: '4.9★',
                                    label: 'Average Rating',
                                    color: 'bg-yellow-50 text-yellow-600',
                                },
                                {
                                    icon: Zap,
                                    value: '5yr',
                                    label: 'In Business',
                                    color: 'bg-green-50 text-green-600',
                                },
                                {
                                    icon: Leaf,
                                    value: '40T',
                                    label: 'CO₂ Saved',
                                    color: 'bg-emerald-50 text-emerald-600',
                                },
                            ].map((stat) => (
                                <div key={stat.label} className='jv-card p-5 sm:p-7 text-center'>
                                    <div
                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${stat.color} flex items-center justify-center mx-auto mb-2 sm:mb-3`}
                                    >
                                        <stat.icon className='w-5 h-5 sm:w-6 sm:h-6' />
                                    </div>
                                    <div className='text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1'>
                                        {stat.value}
                                    </div>
                                    <div className='text-xs sm:text-sm text-slate-500'>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className='jv-section bg-slate-50'>
                <div className='jv-container'>
                    <div className='text-center mb-10 sm:mb-12'>
                        <p className='text-green-500 font-semibold text-sm uppercase tracking-wider mb-2'>
                            What We Stand For
                        </p>
                        <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900'>
                            Our Values
                        </h2>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                        {[
                            {
                                icon: Heart,
                                title: 'Customer First',
                                desc: "Every decision starts with: what's best for our riders? We don't sell what you don't need.",
                            },
                            {
                                icon: Award,
                                title: 'Quality Always',
                                desc: "We only stock bikes and parts we'd ride ourselves. No compromises on safety or reliability.",
                            },
                            {
                                icon: Leaf,
                                title: 'Green Mission',
                                desc: "Every eBike sold is one less petrol engine on Lagos roads. We're serious about reducing emissions.",
                            },
                            {
                                icon: Target,
                                title: 'Local Pride',
                                desc: 'Nigerian owned. Lagos based. Profits reinvested into local jobs and community riding initiatives.',
                            },
                        ].map((val) => (
                            <div key={val.title} className='jv-card p-5 sm:p-7'>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-3 sm:mb-4'>
                                    <val.icon className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
                                </div>
                                <h3 className='font-bold text-slate-900 text-base sm:text-lg mb-2'>
                                    {val.title}
                                </h3>
                                <p className='text-slate-500 text-sm leading-relaxed'>{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className='jv-section bg-white'>
                <div className='jv-container'>
                    <div className='text-center mb-10 sm:mb-12'>
                        <p className='text-green-500 font-semibold text-sm uppercase tracking-wider mb-2'>
                            Meet the Team
                        </p>
                        <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900'>
                            The People Behind Jovico
                        </h2>
                    </div>
                    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
                        {[
                            {
                                name: 'Chukwuemeka Jovita',
                                role: 'Founder & CEO',
                                bio: 'Serial entrepreneur and eBike obsessive. Founded Jovico after one too many hours in Lagos traffic.',
                                emoji: '👨🏾‍💼',
                            },
                            {
                                name: 'Ngozi Adewale',
                                role: 'Head of Operations',
                                bio: 'Logistics pro with 10 years in Lagos retail. Keeps Jovico running like a well-oiled motor.',
                                emoji: '👩🏾‍💼',
                            },
                            {
                                name: 'Seun Okonkwo',
                                role: 'Lead Technician',
                                bio: 'Certified eBike mechanic with expertise in Bosch, Bafang, and Shimano systems.',
                                emoji: '👨🏾‍🔧',
                            },
                            {
                                name: 'Amara Nwosu',
                                role: 'Sales & Customer Care',
                                bio: 'Passionate about matching riders with the perfect eBike. Ask her anything.',
                                emoji: '👩🏾‍💻',
                            },
                        ].map((member) => (
                            <div key={member.name} className='jv-card p-4 sm:p-6 text-center'>
                                <div className='w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-3 sm:mb-4'>
                                    {member.emoji}
                                </div>
                                <h3 className='font-bold text-slate-900 text-sm sm:text-base mb-0.5 leading-tight'>
                                    {member.name}
                                </h3>
                                <p className='text-green-600 text-xs sm:text-sm font-semibold mb-2'>
                                    {member.role}
                                </p>
                                <p className='text-slate-500 text-xs sm:text-sm leading-relaxed hidden sm:block'>
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Location */}
            <section id='location' className='jv-section bg-slate-950'>
                <div className='jv-container'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center'>
                        <div>
                            <p className='text-green-400 font-semibold text-sm uppercase tracking-wider mb-3'>
                                Find Us
                            </p>
                            <h2 className='text-3xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-5'>
                                Visit Our Showroom
                            </h2>
                            <p className='text-slate-400 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base'>
                                Come see the full Jovico range in person. Test ride any bike, meet
                                our team, and get expert advice — all at our Victoria Island
                                showroom.
                            </p>
                            <div className='space-y-3 sm:space-y-4 mb-7 sm:mb-8'>
                                {[
                                    { emoji: '📍', label: 'Address', value: address },
                                    {
                                        emoji: '🕘',
                                        label: 'Hours',
                                        value: 'Mon–Sat: 9am–6pm  |  Sunday: By Appointment',
                                    },
                                    { emoji: '✉️', label: 'Email', value: 'hello@jovicobikes.com' },
                                ].map((info) => (
                                    <div key={info.label} className='flex items-start gap-3'>
                                        <span className='text-lg mt-0.5 shrink-0'>
                                            {info.emoji}
                                        </span>
                                        <div>
                                            <div className='text-slate-400 text-[10px] uppercase tracking-wider mb-0.5'>
                                                {info.label}
                                            </div>
                                            <div className='text-white text-sm font-medium'>
                                                {info.value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href='/contact' className='jv-btn-green'>
                                Get Directions <ArrowRight className='w-4 h-4' />
                            </Link>
                        </div>

                        {/* Map placeholder */}
                        <div className='w-full max-w-lg mx-auto aspect-square rounded-2xl sm:rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center text-center'>
                            <div className='px-6'>
                                <div className='text-4xl sm:text-5xl mb-3'>📍</div>
                                <div className='text-white font-semibold text-sm sm:text-base'>
                                    Victoria Island, Lagos
                                </div>
                                <div className='text-slate-400 text-xs sm:text-sm mt-1'>
                                    {address}
                                </div>
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='mt-4 inline-flex items-center gap-1.5 text-green-400 text-sm font-medium hover:text-green-300 transition-colors'
                                >
                                    Open in Maps <ArrowRight className='w-3.5 h-3.5' />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Careers CTA */}
            <section id='careers' className='py-14 sm:py-16 bg-green-500'>
                <div className='jv-container text-center'>
                    <h2 className='text-2xl sm:text-3xl font-extrabold text-white mb-3'>
                        Join the Jovico Team
                    </h2>
                    <p className='text-green-100 mb-6 max-w-md mx-auto text-sm sm:text-base'>
                        Passionate about electric mobility and great customer service? We&apos;d
                        love to hear from you.
                    </p>
                    <Link
                        href='/contact'
                        className='inline-flex items-center gap-2 rounded-full bg-white text-green-700 font-bold px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base hover:bg-green-50 transition-colors'
                    >
                        View Opportunities <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5' />
                    </Link>
                </div>
            </section>
        </>
    )
}
