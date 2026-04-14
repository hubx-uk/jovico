'use client'
// components/layout/Footer.tsx

import Link from 'next/link'
import { Zap, Instagram, Twitter, Facebook, MessageCircle, Mail, Phone, MapPin } from 'lucide-react'

const shopLinks = [
    { label: 'City Bikes', href: '/shop?category=city' },
    { label: 'Mountain Bikes', href: '/shop?category=mountain' },
    { label: 'Cargo Bikes', href: '/shop?category=cargo' },
    { label: 'Folding Bikes', href: '/shop?category=folding' },
    { label: 'Accessories', href: '/accessories' },
]

const serviceLinks = [
    { label: 'Basic Tune-Up', href: '/services#tune-up' },
    { label: 'Full Overhaul', href: '/services#overhaul' },
    { label: 'Battery Service', href: '/services#battery' },
    { label: 'Tyre & Tube', href: '/services#tyres' },
    { label: 'Motor Repair', href: '/services#motor' },
]

const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/about#careers' },
    { label: 'Press', href: '/about#press' },
]

export function Footer() {
    return (
        <footer className='bg-slate-950 text-slate-300'>
            {/* Newsletter bar */}
            <div className='border-b border-slate-800'>
                <div className='jv-container py-10 flex flex-col md:flex-row items-center justify-between gap-6'>
                    <div>
                        <h3 className='text-white font-semibold text-lg mb-1'>
                            Join the Jovico Community
                        </h3>
                        <p className='text-slate-400 text-sm'>
                            Get exclusive deals, riding tips and Lagos eBike news.
                        </p>
                    </div>
                    <form
                        className='flex gap-3 w-full md:w-auto'
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type='email'
                            placeholder='your@email.com'
                            className='flex-1 md:w-72 px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500'
                        />
                        <button
                            type='submit'
                            className='jv-btn-green whitespace-nowrap !rounded-2xl text-sm'
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Main footer */}
            <div className='jv-container py-14'>
                <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12'>
                    {/* Brand */}
                    <div className='col-span-2 lg:col-span-2'>
                        <Link href='/' className='flex items-center gap-2 mb-5 group'>
                            <div className='w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-green-500 transition-colors'>
                                <Zap className='w-5 h-5 text-white' strokeWidth={2.5} />
                            </div>
                            <span className='font-bold text-white text-lg tracking-tight'>
                                Jovico<span className='text-green-500'>.</span>
                            </span>
                        </Link>
                        <p className='text-slate-400 text-sm leading-relaxed mb-6 max-w-xs'>
                            Lagos's premier eBike destination. We sell, service and support electric
                            bikes built for Nigerian roads and lifestyles.
                        </p>
                        <div className='space-y-2 text-sm text-slate-400'>
                            <a
                                href='tel:+2348012345678'
                                className='flex items-center gap-2 hover:text-white transition-colors'
                            >
                                <Phone className='w-4 h-4 text-green-500' />
                                +234 801 234 5678
                            </a>
                            <a
                                href='mailto:hello@jovicobikes.com'
                                className='flex items-center gap-2 hover:text-white transition-colors'
                            >
                                <Mail className='w-4 h-4 text-green-500' />
                                hello@jovicobikes.com
                            </a>
                            <div className='flex items-start gap-2'>
                                <MapPin className='w-4 h-4 text-green-500 mt-0.5 shrink-0' />
                                <span>14 Adeola Odeku St, Victoria Island, Lagos</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className='text-white font-semibold text-sm mb-4 uppercase tracking-wider'>
                            Shop
                        </h4>
                        <ul className='space-y-2.5'>
                            {shopLinks.map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className='text-sm text-slate-400 hover:text-white transition-colors'
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className='text-white font-semibold text-sm mb-4 uppercase tracking-wider'>
                            Services
                        </h4>
                        <ul className='space-y-2.5'>
                            {serviceLinks.map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className='text-sm text-slate-400 hover:text-white transition-colors'
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className='text-white font-semibold text-sm mb-4 uppercase tracking-wider'>
                            Company
                        </h4>
                        <ul className='space-y-2.5'>
                            {companyLinks.map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className='text-sm text-slate-400 hover:text-white transition-colors'
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className='border-t border-slate-800'>
                <div className='jv-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <p className='text-slate-500 text-sm'>
                        © {new Date().getFullYear()} Jovico Bikes Ltd. All rights reserved.
                    </p>
                    <div className='flex items-center gap-4'>
                        <a
                            href='https://instagram.com/jovicobikes'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-500 hover:text-white transition-colors'
                        >
                            <Instagram className='w-5 h-5' />
                        </a>
                        <a
                            href='https://twitter.com/jovicobikes'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-500 hover:text-white transition-colors'
                        >
                            <Twitter className='w-5 h-5' />
                        </a>
                        <a
                            href='https://facebook.com/jovicobikes'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-500 hover:text-white transition-colors'
                        >
                            <Facebook className='w-5 h-5' />
                        </a>
                        <a
                            href='https://wa.me/2348012345678'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-500 hover:text-green-400 transition-colors'
                        >
                            <MessageCircle className='w-5 h-5' />
                        </a>
                    </div>
                    <div className='flex items-center gap-4 text-sm text-slate-500'>
                        <Link href='/privacy' className='hover:text-white transition-colors'>
                            Privacy
                        </Link>
                        <Link href='/terms' className='hover:text-white transition-colors'>
                            Terms
                        </Link>
                    </div>
                </div>
            </div>

            {/* WhatsApp floating button */}
            <a
                href='https://wa.me/2348012345678?text=Hi%20Jovico%20Bikes!%20I%27d%20like%20to%20enquire%20about%20your%20eBikes.'
                target='_blank'
                rel='noopener noreferrer'
                className='fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-500/30 transition-transform hover:scale-110'
                aria-label='WhatsApp'
            >
                <MessageCircle className='w-7 h-7' fill='white' />
            </a>
        </footer>
    )
}
