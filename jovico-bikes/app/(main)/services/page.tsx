// app/main/services/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import {
    CheckCircle2,
    Clock,
    ArrowRight,
    Wrench,
    Zap,
    Battery,
    Circle,
    Settings,
    Shield,
    MessageCircle,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatNaira } from '@/lib/utils'
import { BookingForm } from '@/components/home/BookingForm'

export const metadata: Metadata = {
    title: 'eBike Services',
    description:
        "Expert eBike servicing and repair in Lagos. From basic tune-ups to full motor overhauls — Jovico's certified technicians have you covered.",
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    wrench: Wrench,
    settings: Settings,
    battery: Battery,
    circle: Circle,
    zap: Zap,
    shield: Shield,
}

export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        where: { published: true },
        orderBy: { order: 'asc' },
    })

    const featured = services.filter((s) => s.featured)
    const rest = services.filter((s) => !s.featured)

    return (
        <>
            {/* Hero */}
            <section className='pt-28 sm:pt-32 pb-16 sm:pb-20 bg-slate-950 relative overflow-hidden'>
                <div
                    className='absolute inset-0 opacity-[0.03]'
                    style={{
                        backgroundImage:
                            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
                <div className='jv-container relative z-10'>
                    <p className='text-green-400 font-semibold text-sm uppercase tracking-wider mb-2'>
                        Expert Care
                    </p>
                    <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 sm:mb-5 max-w-2xl'>
                        eBike Services &amp; Repairs
                    </h1>
                    <p className='text-slate-400 text-base md:text-lg max-w-xl leading-relaxed mb-7 sm:mb-8'>
                        Our fully-equipped Lagos workshop keeps your electric bike in peak
                        condition. Certified technicians, genuine parts, fast turnaround.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                        <a
                            href='#book'
                            className='jv-btn-green text-base !px-8 !py-4 justify-center'
                        >
                            Book a Service <ArrowRight className='w-5 h-5' />
                        </a>
                        <a
                            href="https://wa.me/2348012345678?text=Hi! I'd like to book a service for my eBike."
                            target='_blank'
                            rel='noopener noreferrer'
                            className='jv-btn-secondary !border-slate-600 !text-slate-300 hover:!bg-slate-800 hover:!text-white text-base !px-8 !py-4 justify-center'
                        >
                            <MessageCircle className='w-5 h-5' />
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            </section>

            {/* Featured services */}
            <section className='jv-section bg-white'>
                <div className='jv-container'>
                    <div className='text-center mb-12'>
                        <p className='text-green-500 font-semibold text-sm uppercase tracking-wider mb-2'>
                            Most Popular
                        </p>
                        <h2 className='text-4xl font-extrabold text-slate-900'>
                            Our Core Services
                        </h2>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {featured.map((service) => {
                            const Icon = ICON_MAP[service.icon ?? 'wrench'] ?? Wrench
                            return (
                                <div
                                    key={service.id}
                                    id={service.slug}
                                    className='jv-card p-8 flex flex-col'
                                >
                                    <div className='w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-5'>
                                        <Icon className='w-7 h-7 text-white' />
                                    </div>
                                    <h3 className='text-xl font-bold text-slate-900 mb-2'>
                                        {service.name}
                                    </h3>
                                    <p className='text-slate-500 text-sm leading-relaxed mb-5 flex-1'>
                                        {service.description}
                                    </p>
                                    <div className='space-y-2 mb-6'>
                                        {service.duration && (
                                            <div className='flex items-center gap-2 text-sm text-slate-600'>
                                                <Clock className='w-4 h-4 text-green-500' />
                                                <span>{service.duration}</span>
                                            </div>
                                        )}
                                        {service.priceNote && (
                                            <div className='flex items-center gap-2 text-xs text-slate-400'>
                                                <CheckCircle2 className='w-3.5 h-3.5 text-green-400' />
                                                <span>{service.priceNote}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <span className='text-2xl font-extrabold text-slate-900'>
                                                {formatNaira(Number(service.price))}
                                            </span>
                                        </div>
                                        <a
                                            href='#book'
                                            className='jv-btn-green !px-5 !py-2.5 text-sm'
                                        >
                                            Book Now
                                        </a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* All services grid */}
            {rest.length > 0 && (
                <section className='jv-section bg-slate-50'>
                    <div className='jv-container'>
                        <h2 className='text-3xl font-extrabold text-slate-900 mb-8'>
                            Additional Services
                        </h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                            {rest.map((service) => {
                                const Icon = ICON_MAP[service.icon ?? 'wrench'] ?? Wrench
                                return (
                                    <div
                                        key={service.id}
                                        id={service.slug}
                                        className='jv-card p-6 flex gap-4'
                                    >
                                        <div className='w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0'>
                                            <Icon className='w-5 h-5 text-slate-700' />
                                        </div>
                                        <div className='flex-1'>
                                            <h3 className='font-bold text-slate-900 mb-1'>
                                                {service.name}
                                            </h3>
                                            <p className='text-sm text-slate-500 mb-3 line-clamp-2'>
                                                {service.shortDesc}
                                            </p>
                                            <div className='flex items-center justify-between'>
                                                <span className='font-bold text-slate-900 text-sm'>
                                                    {service.price
                                                        ? formatNaira(Number(service.price))
                                                        : 'On Request'}
                                                </span>
                                                {service.duration && (
                                                    <span className='text-xs text-slate-400 flex items-center gap-1'>
                                                        <Clock className='w-3 h-3' />{' '}
                                                        {service.duration}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Process */}
            <section className='jv-section bg-white'>
                <div className='jv-container'>
                    <div className='text-center mb-12'>
                        <p className='text-green-500 font-semibold text-sm uppercase tracking-wider mb-2'>
                            How It Works
                        </p>
                        <h2 className='text-4xl font-extrabold text-slate-900'>
                            Simple. Fast. Reliable.
                        </h2>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6'>
                        {[
                            {
                                step: '01',
                                title: 'Book Online',
                                desc: 'Choose your service and preferred date using our simple booking form.',
                            },
                            {
                                step: '02',
                                title: 'Drop Off',
                                desc: 'Bring your eBike to our Victoria Island workshop at your booked time.',
                            },
                            {
                                step: '03',
                                title: 'We Service It',
                                desc: 'Our certified technicians get to work with genuine parts and diagnostic tools.',
                            },
                            {
                                step: '04',
                                title: 'Pick Up & Ride',
                                desc: 'Collect your bike, fully serviced and ready to tackle Lagos again.',
                            },
                        ].map((item) => (
                            <div key={item.step} className='text-center'>
                                <div className='w-16 h-16 rounded-full bg-slate-900 text-white text-xl font-extrabold flex items-center justify-center mx-auto mb-4'>
                                    {item.step}
                                </div>
                                <h3 className='font-bold text-slate-900 text-lg mb-2'>
                                    {item.title}
                                </h3>
                                <p className='text-slate-500 text-sm leading-relaxed'>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking Form */}
            <section id='book' className='jv-section bg-slate-50'>
                <div className='jv-container max-w-2xl'>
                    <div className='text-center mb-10'>
                        <p className='text-green-500 font-semibold text-sm uppercase tracking-wider mb-2'>
                            Get Started
                        </p>
                        <h2 className='text-4xl font-extrabold text-slate-900'>Book a Service</h2>
                        <p className='text-slate-500 mt-3'>
                            Fill in the form and our team will confirm your appointment within 2
                            hours.
                        </p>
                    </div>
                    <BookingForm services={services.map((s) => ({ id: s.id, name: s.name }))} />
                </div>
            </section>
        </>
    )
}
