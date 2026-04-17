// app/main/accessories/page.tsx
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { prisma } from '@/lib/prisma'
import { formatNaira } from '@/lib/utils'

export const metadata: Metadata = {
    title: 'Accessories',
    description: 'Shop eBike accessories, helmets, locks, chargers and more at Jovico Bikes Lagos.',
}

export default async function AccessoriesPage() {
    const accessories = await prisma.product.findMany({
        where: { published: true, type: 'ACCESSORY' },
        include: { images: { where: { isPrimary: true }, take: 1 } },
        orderBy: { createdAt: 'desc' },
    })

    const categories = [
        { emoji: '⛑️', name: 'Helmets', desc: 'Safe and stylish. Every ride.' },
        { emoji: '🔒', name: 'Locks & Security', desc: 'Protect your investment.' },
        { emoji: '🔋', name: 'Chargers & Batteries', desc: 'Keep the power flowing.' },
        { emoji: '💡', name: 'Lights', desc: 'See and be seen at night.' },
        { emoji: '🎽', name: 'Riding Apparel', desc: 'Look great. Ride comfortably.' },
        { emoji: '🛠️', name: 'Tools & Maintenance', desc: 'Keep your bike dialled in.' },
        { emoji: '📱', name: 'Mounts & Tech', desc: 'Phone mounts, GPS and more.' },
        { emoji: '🎒', name: 'Bags & Racks', desc: 'Carry more. Go further.' },
    ]

    return (
        <>
            {/* Hero */}
            <section className='pt-28 sm:pt-32 pb-16 bg-slate-950'>
                <div className='jv-container'>
                    <p className='text-green-400 font-semibold text-sm uppercase tracking-wider mb-2'>
                        Gear Up
                    </p>
                    <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4'>
                        Accessories
                    </h1>
                    <p className='text-slate-400 text-lg max-w-xl'>
                        Everything you need to ride safely and stylishly in Lagos. Premium
                        accessories for every eBike rider.
                    </p>
                </div>
            </section>

            {/* Categories */}
            <section className='jv-section bg-white'>
                <div className='jv-container'>
                    <h2 className='text-3xl font-extrabold text-slate-900 mb-8'>
                        Browse by Category
                    </h2>
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                        {categories.map((cat) => (
                            <div
                                key={cat.name}
                                className='group jv-card p-6 text-center cursor-pointer hover:border-slate-300 transition-all'
                            >
                                <div className='text-4xl mb-3 group-hover:scale-110 transition-transform duration-300'>
                                    {cat.emoji}
                                </div>
                                <h3 className='font-bold text-slate-900 text-sm mb-1'>
                                    {cat.name}
                                </h3>
                                <p className='text-xs text-slate-400'>{cat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className='jv-section bg-slate-50'>
                <div className='jv-container'>
                    <h2 className='text-3xl font-extrabold text-slate-900 mb-8'>
                        {accessories.length > 0 ? 'All Accessories' : 'Coming Soon'}
                    </h2>

                    {accessories.length === 0 ? (
                        <div className='text-center py-20 jv-card'>
                            <div className='text-6xl mb-4'>🎽</div>
                            <h3 className='text-xl font-bold text-slate-900 mb-2'>
                                Accessories Coming Soon
                            </h3>
                            <p className='text-slate-500 mb-6'>
                                We're stocking up our accessories range. Get notified when we
                                launch!
                            </p>
                            <a
                                href='https://wa.me/2348012345678?text=Hi! Please notify me when your accessories are available.'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='jv-btn-green'
                            >
                                Notify Me on WhatsApp
                            </a>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                            {accessories.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/shop/${item.slug}`}
                                    className='group jv-card bg-white overflow-hidden'
                                >
                                    <div className='aspect-square bg-slate-50 rounded-t-3xl flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300'>
                                        🎽
                                    </div>
                                    <div className='p-5'>
                                        <h3 className='font-bold text-slate-900 text-sm mb-1 group-hover:text-green-600 transition-colors'>
                                            {item.name}
                                        </h3>
                                        <div className='flex items-center justify-between'>
                                            <span className='font-extrabold text-slate-900'>
                                                {formatNaira(Number(item.price))}
                                            </span>
                                            <div className='w-8 h-8 rounded-full bg-slate-900 group-hover:bg-green-500 flex items-center justify-center transition-colors'>
                                                <ArrowRight className='w-3.5 h-3.5 text-white' />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Enquiry CTA */}
            <section className='py-16 bg-slate-900'>
                <div className='jv-container text-center'>
                    <h2 className='text-3xl font-extrabold text-white mb-3'>
                        Can't Find What You Need?
                    </h2>
                    <p className='text-slate-400 mb-6'>
                        We can source any eBike accessory or spare part. Just ask us!
                    </p>
                    <a
                        href="https://wa.me/2348012345678?text=Hi! I'm looking for a specific eBike accessory."
                        target='_blank'
                        rel='noopener noreferrer'
                        className='jv-btn-green'
                    >
                        Ask on WhatsApp <ArrowRight className='w-4 h-4' />
                    </a>
                </div>
            </section>
        </>
    )
}
