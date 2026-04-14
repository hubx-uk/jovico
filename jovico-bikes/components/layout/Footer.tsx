'use client'
// components/layout/Footer.tsx

import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'
import { BikeIcon, Instagram, Twitter, Facebook, MessageCircle, Mail, Phone, MapPin, Loader2 } from 'lucide-react'

import { useSiteSettings } from './SiteSettingsProvider'

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
    const s = useSiteSettings();
    const [email, setEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);

    async function handleSubscribe(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        setSubscribing(true);
        try {
        const res = await fetch("/api/subscribers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error();
        toast.success("You're subscribed! Welcome to the Jovico community.");
        setEmail("");
        } catch {
        toast.error("Subscription failed. Please try again.");
        } finally {
        setSubscribing(false);
        }
    }

    const waNumber = s.whatsapp.replace(/\D/g, "");
    const waUrl = `https://wa.me/${waNumber}`;

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
                         onSubmit={handleSubscribe} className="flex gap-3 w-full lg:w-auto lg:max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 md:w-72 px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button type="submit" disabled={subscribing} className="jv-btn-green whitespace-nowrap !rounded-2xl text-sm shrink-0 disabled:opacity-60">
                {subscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
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
                                <BikeIcon className='w-5 h-5 text-white' strokeWidth={2.5} />
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
                                href={`tel:${s.phone.replace(/\s/g, "")}`}
                                className='flex items-center gap-2 hover:text-white transition-colors'
                            >
                                <Phone className='w-4 h-4 text-green-500' />
                                {s.phone}
                            </a>
                            <a
                                href={`mailto:${s.email}`}
                                className='flex items-center gap-2 hover:text-white transition-colors'
                            >
                                <Mail className='w-4 h-4 text-green-500' />
                                <span>{s.email}</span>
                            </a>
                            <div className='flex items-start gap-2'>
                                <MapPin className='w-4 h-4 text-green-500 mt-0.5 shrink-0' />
                                <span className="leading-relaxed">{s.address}</span>
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
                        © {new Date().getFullYear()} {s.site_name} Ltd. All rights reserved.
                    </p>
                    <div className='flex items-center gap-4'>
                        {s.instagram && <a
                            href={s.instagram}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-500 hover:text-white transition-colors'
                            aria-label="Instagram"
                        >
                            <Instagram className='w-5 h-5' />
                        </a>}
                        {s.twitter && <a
                            href={s.twitter}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-500 hover:text-white transition-colors'
                            aria-label="Twitter"
                        >
                            <Twitter className='w-5 h-5' />
                        </a>}
                        {s.facebook && <a
                            href={s.facebook}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-500 hover:text-white transition-colors'
                            aria-label="Facebook"
                        >
                            <Facebook className='w-5 h-5' />
                        </a>}
                        <a
                            href={waUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-500 hover:text-green-400 transition-colors'
                            aria-label="WhatsApp"
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
                href={`${waUrl}?text=Hi%20${encodeURIComponent(s.site_name)}!%20I%27d%20like%20to%20enquire%20about%20your%20eBikes.`}
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
