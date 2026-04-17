'use client'
// components/layout/Navbar.tsx
import { Menu, X, ShoppingBag, Zap, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Services', href: '/services' },
    { label: 'Accessories', href: '/accessories' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
]

export function Navbar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const readCart = () => {
            try {
                const items = JSON.parse(localStorage.getItem('jovico_cart') || '[]')
                setCartCount(
                    items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0)
                )
            } catch {
                setCartCount(0)
            }
        }
        readCart()
        window.addEventListener('cart-updated', readCart)
        return () => window.removeEventListener('cart-updated', readCart)
    }, [])

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled
                    ? 'bg-white/95 backdrop-blur-lg shadow-sm'
                    : 'bg-transparent'
            )}
            style={{ height: 'var(--nav-height)' }}
        >
            <nav className='jv-container flex items-center justify-between h-full'>
                {/* Logo */}
                <Link href='/' className='flex items-center gap-2 group'>
                    <div className='w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300'>
                        <Zap className='w-5 h-5 text-white' strokeWidth={2.5} />
                    </div>
                    <span className={cn(
                            'font-bold text-lg text-base sm:text-lg tracking-tight',
                            scrolled
                                ? 'text-slate-700 hover:text-slate-900'
                                : 'text-slate-400 hover:text-slate-200'
                        )}
                    >
                        Jovico<span className='text-green-500'>.</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <ul className='hidden md:flex items-center gap-1'>
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={cn(
                                    'nav-link px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium',
                                    pathname === link.href || pathname.startsWith(`${link.href}/`)
                                        ? scrolled
                                            ? 'bg-slate-200'
                                            : 'bg-slate-800'
                                        : '',
                                    scrolled
                                        ? 'text-slate-600 hover:text-slate-900'
                                        : 'text-slate-400 hover:text-slate-200'
                                )}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Desktop CTA */}
                <div className='hidden md:flex items-center gap-3'>
                    {/* Account */}
                    <Link
                        href='/account'
                        className='p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors'
                        aria-label='My Account'
                    >
                        <User className='w-5 h-5' />
                    </Link>
                    {/* Cart */}
                    <Link
                        href='/cart'
                        className='relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors'
                        aria-label='Cart'
                    >
                        <ShoppingBag className='w-5 h-5' />
                        {cartCount > 0 && (
                            <span
                                className='absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center'
                                style={{ width: '1.1rem', height: '1.1rem', fontSize: '10px' }}
                            >
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>
                    <Link href='/shop' className='jv-btn-primary text-sm !px-5 !py-2.5'>
                        Shop Now
                    </Link>
                </div>

                {/* Mobile toggle */}
                <div className='md:hidden flex items-center gap-2'>
                    <Link
                        href='/cart'
                        className='relative p-2 rounded-xl text-slate-600 hover:text-slate-900 transition-colors'
                        aria-label='Cart'
                    >
                        <ShoppingBag className='w-5 h-5' />
                        {cartCount > 0 && (
                            <span className='absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center'>
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>
                    <button
                        type='button'
                        className='p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors'
                        onClick={() => setOpen(!open)}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                    >
                        {open ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {open && (
                <div className='md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl rounded-b-3xl overflow-hidden animate-slide-in-right'>
                    <div className='jv-container py-6 space-y-1'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'flex items-center py-3 px-4 rounded-2xl text-sm font-medium transition-colors',
                                    pathname === link.href
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-700 hover:bg-slate-50'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className='pt-4'>
                            <Link href='/shop' className='jv-btn-primary w-full justify-center'>
                                Shop Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
