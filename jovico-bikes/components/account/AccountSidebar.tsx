'use client'
// components/account/AccountSidebar.tsx
import Link from 'next/link'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
import { User, ShoppingBag, Shield, LogOut, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

const navItems = [
    { href: '/account', label: 'Dashboard', icon: User, exact: true },
    { href: '/account/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/account/profile', label: 'Profile & Password', icon: Shield },
]

interface Props {
    name: string
    email: string
}

export function AccountSidebar({ name, email }: Props) {
    const pathname = usePathname()
    const router = useRouter()

    async function handleLogout() {
        await fetch('/api/customer/auth', { method: 'DELETE' })
        toast.success('Logged out')
        router.push('/')
        router.refresh()
    }

    return (
        <aside className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
            {/* User info */}
            <div className='px-5 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg shrink-0'>
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div className='min-w-0'>
                        <p className='text-white font-semibold text-sm truncate'>{name}</p>
                        <p className='text-slate-400 text-xs truncate'>{email}</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className='p-2 space-y-0.5'>
                {navItems.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                                isActive
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            )}
                        >
                            <item.icon className='w-4 h-4 shrink-0' />
                            <span className='flex-1'>{item.label}</span>
                            {isActive && <ChevronRight className='w-3.5 h-3.5 opacity-50' />}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className='p-2 border-t border-slate-100 mt-1'>
                <button
                    type='button'
                    onClick={handleLogout}
                    className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full'
                >
                    <LogOut className='w-4 h-4 shrink-0' />
                    Log Out
                </button>
            </div>
        </aside>
    )
}
