'use client'
import {
    BarChart3,
    Bell,
    Bike,
    BookOpen,
    LayoutDashboard,
    LogOut,
    Mail,
    Menu,
    MessageSquare,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Tag,
    Users,
    Wrench,
    X,
    Zap,
} from 'lucide-react'
// components/admin/AdminSidebar.tsx
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

const navGroups = [
    {
        label: 'Overview',
        items: [
            { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
            { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
        ],
    },
    {
        label: 'Store',
        items: [
            { icon: ShoppingBag, label: 'Products', href: '/admin/shop' },
            { icon: Tag, label: 'Accessories', href: '/admin/accessories' },
            { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
        ],
    },
    {
        label: 'Content',
        items: [
            { icon: BookOpen, label: 'Blog Posts', href: '/admin/blog' },
            { icon: Wrench, label: 'Services', href: '/admin/services' },
        ],
    },
    {
        label: 'Customers',
        items: [
            { icon: Mail, label: 'Enquiries', href: '/admin/enquiries' },
            { icon: MessageSquare, label: 'Bookings', href: '/admin/bookings' },
            { icon: Users, label: 'Subscribers', href: '/admin/subscribers' },
        ],
    },
    {
        label: 'System',
        items: [
            { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
            { icon: Settings, label: 'Settings', href: '/admin/settings' },
        ],
    },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    async function handleLogout() {
        await fetch('/api/auth', { method: 'DELETE' })
        toast.success('Logged out successfully')
        router.push('/admin/login')
    }

    const SidebarContent = () => (
        <div className='flex flex-col h-full'>
            {/* Logo */}
            <div className='flex items-center gap-3 px-4 py-5 border-b border-slate-100'>
                <div className='w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shrink-0'>
                    <Bike className='w-5 h-5 text-white' />
                </div>
                {!collapsed && (
                    <div>
                        <div className='font-bold text-slate-900 text-sm leading-none'>
                            Jovico<span className='text-green-500'>.</span>
                        </div>
                        <div className='text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5'>
                            Admin
                        </div>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className='flex-1 overflow-y-auto py-4 px-2 space-y-5'>
                {navGroups.map((group) => (
                    <div key={group.label}>
                        {!collapsed && (
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1.5'>
                                {group.label}
                            </p>
                        )}
                        <ul className='space-y-0.5'>
                            {group.items.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== '/admin' && pathname.startsWith(item.href))
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            title={collapsed ? item.label : undefined}
                                            className={cn(
                                                'admin-nav-item',
                                                isActive ? 'active' : '',
                                                collapsed ? 'justify-center px-2' : ''
                                            )}
                                        >
                                            <item.icon
                                                className='w-4.5 h-4.5 shrink-0'
                                                style={{ width: 18, height: 18 }}
                                            />
                                            {!collapsed && (
                                                <span className='text-sm'>{item.label}</span>
                                            )}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className='border-t border-slate-100 p-3 space-y-1'>
                <Link
                    href='/'
                    target='_blank'
                    className={cn('admin-nav-item', collapsed ? 'justify-center px-2' : '')}
                >
                    <Zap style={{ width: 18, height: 18 }} className='shrink-0 text-green-500' />
                    {!collapsed && <span className='text-sm'>View Site</span>}
                </Link>
                <button
                    type='button'
                    onClick={handleLogout}
                    className={cn(
                        'admin-nav-item w-full text-left text-red-500 hover:bg-red-50',
                        collapsed ? 'justify-center px-2' : ''
                    )}
                >
                    <LogOut style={{ width: 18, height: 18 }} className='shrink-0' />
                    {!collapsed && <span className='text-sm'>Log Out</span>}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    'hidden lg:flex flex-col bg-white border-r border-slate-100 h-screen sticky top-0 transition-all duration-300',
                    collapsed ? 'w-16' : 'w-56'
                )}
            >
                {/* Collapse toggle */}
                <button
                    type='button'
                    onClick={() => setCollapsed(!collapsed)}
                    className='absolute -right-3 top-7 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md z-10 transition-shadow'
                >
                    <Menu className='w-3 h-3 text-slate-500' />
                </button>
                <SidebarContent />
            </aside>

            {/* Mobile header */}
            <div className='lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-100 flex items-center justify-between px-4 py-3 h-14'>
                <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center'>
                        <Zap className='w-4 h-4 text-white' />
                    </div>
                    <span className='font-bold text-slate-900 text-sm'>Jovico Admin</span>
                </div>
                <button
                    type='button'
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className='p-2 rounded-xl text-slate-600 hover:bg-slate-100'
                >
                    {mobileOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
                </button>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div
                    className='lg:hidden fixed inset-0 z-30 flex pt-14'
                    onClick={() => setMobileOpen(false)}
                >
                    <div
                        className='w-64 bg-white h-full border-r border-slate-100 shadow-xl'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SidebarContent />
                    </div>
                    <div className='flex-1 bg-black/30 backdrop-blur-sm' />
                </div>
            )}
        </>
    )
}
