import { EBikeROICalculator } from '@/components/home/EBikeROICalculator'
import { HomepageVideoSection } from '@/components/home/HomepageVideoSection'
import { prisma } from '@/lib/prisma'
import { formatDate, formatNaira } from '@/lib/utils'
import {
    ArrowRight,
    Award,
    Battery,
    CheckCircle2,
    ChevronRight,
    Clock,
    MapPin,
    Shield,
    Star,
    Users,
    Wind,
    Wrench,
    Zap,
} from 'lucide-react'
// app/(main)/page.tsx
import Link from 'next/link'

// ─── Server data fetching ──────────────────────────────────
async function getFeaturedBikes() {
    return prisma.product.findMany({
        where: { featured: true, published: true, type: 'BIKE' },
        include: { images: { where: { isPrimary: true }, take: 1 } },
        take: 4,
        orderBy: { createdAt: 'desc' },
    })
}

async function getFeaturedPosts() {
    return prisma.post.findMany({
        where: { published: true },
        take: 3,
        orderBy: { publishedAt: 'desc' },
    })
}

async function getFeaturedServices() {
    return prisma.service.findMany({
        where: { featured: true, published: true },
        take: 3,
        orderBy: { order: 'asc' },
    })
}

async function getVideoSettings() {
    try {
        const rows = await prisma.siteSetting.findMany({
            where: {
                key: {
                    in: [
                        'hero_video_url',
                        'hero_video_poster',
                        'hero_video_title',
                        'hero_video_subtitle',
                    ],
                },
            },
        })
        return Object.fromEntries(rows.map((r) => [r.key, r.value]))
    } catch {
        return {}
    }
}

// ─── Home Page ─────────────────────────────────────────────
export default async function HomePage() {
    const [bikes, posts, services, videoSettings] = await Promise.all([
        getFeaturedBikes(),
        getFeaturedPosts(),
        getFeaturedServices(),
        getVideoSettings(),
    ])

    return (
        <>
            {/* ═══ HERO ══════════════════════════════════════════ */}
            <section className='relative min-h-screen flex items-center overflow-hidden bg-slate-950'>
                {/* Background effects */}
                <div
                    className='absolute inset-0 pointer-events-none'
                    style={{
                        backgroundImage:
                            'radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(148,163,184,0.1) 0%, transparent 50%)',
                    }}
                />
                <div className='absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/4 rounded-full bg-green-500/5 blur-3xl pointer-events-none' />
                <div className='absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-slate-800/50 blur-3xl pointer-events-none' />

                {/* Grid pattern overlay */}
                <div
                    className='absolute inset-0 opacity-[0.03] pointer-events-none'
                    style={{
                        backgroundImage:
                            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                <div className='jv-container relative z-10 pt-32 pb-20'>
                    <div className='grid lg:grid-cols-2 gap-10 lg:gap-6 items-center'>
                        {/* Left: Copy */}
                        <div>
                            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-green-400 text-sm font-medium mb-6 sm:mb-8'>
                                <Zap className='w-3.5 h-3.5' />
                                Lagos&apos;s #1 eBike Destination
                            </div>

                            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-5 sm:mb-6'>
                                Ride <span className='text-green-400'>Electric.</span>
                                <br />
                                Ride <span className='text-slate-300'>Lagos.</span>
                            </h1>

                            <p className='text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-md'>
                                Beat the traffic. Skip the fuel queue. Discover Nigeria&apos;s
                                finest electric bikes, built for Lagos roads and backed by expert
                                servicing.
                            </p>

                            <div className='flex flex-col sm:flex-row gap-3'>
                                <Link href='/shop' className='jv-btn-green text-base !px-8 !py-4'>
                                    Shop eBikes <ArrowRight className='w-5 h-5' />
                                </Link>
                                <Link
                                    href='/services'
                                    className='jv-btn-secondary !border-slate-600 !text-slate-300 hover:!bg-slate-800 hover:!text-white text-base !px-8 !py-4'
                                >
                                    Book a Service
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className='flex flex-wrap gap-6 sm:gap-8 mt-10 pt-8 border-t border-slate-800'>
                                {[
                                    { value: '500+', label: 'Happy Riders' },
                                    { value: '5yr', label: 'In Business' },
                                    { value: '4.9★', label: 'Rating' },
                                    { value: '24h', label: 'Response' },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className='text-xl sm:text-2xl font-bold text-white'>
                                            {stat.value}
                                        </div>
                                        <div className='text-xs sm:text-sm text-slate-500'>
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Bike visual — hidden on small, shown md+ */}
                        <div className='hidden md:flex relative items-center justify-center'>
                            <div className='absolute inset-0 rounded-full bg-green-500/10 blur-3xl scale-75' />

                            <div className='relative w-full max-w-lg aspect-square'>
                                <div className='absolute inset-0 rounded-full bg-gradient-to-br from-slate-800/50 to-transparent border border-slate-700/50' />
                                <div className='absolute inset-8 rounded-full bg-gradient-to-br from-slate-800/30 to-transparent border border-slate-700/30' />
                                <div className='absolute inset-16 rounded-full bg-gradient-to-br from-green-500/10 to-transparent' />

                                <div className='absolute inset-0 flex items-center justify-center'>
                                    <div className='text-center'>
                                        <div className='text-6xl sm:text-8xl mb-4 animate-float'>
                                            🚴
                                        </div>
                                        <div className='text-white/60 text-sm font-medium'>
                                            Jovico City Cruiser Pro
                                        </div>
                                        <div className='text-green-400 font-bold'>₦485,000</div>
                                    </div>
                                </div>

                                {/* Feature pills — only on large screens */}
                                <div
                                    className='hidden lg:flex absolute top-8 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 items-center gap-2.5 animate-float'
                                    style={{ animationDelay: '0.5s' }}
                                >
                                    <div className='w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center'>
                                        <Battery className='w-4 h-4 text-green-600' />
                                    </div>
                                    <div>
                                        <div className='text-xs text-slate-500'>Range</div>
                                        <div className='text-sm font-bold text-slate-900'>60km</div>
                                    </div>
                                </div>

                                <div
                                    className='hidden lg:flex absolute bottom-12 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 items-center gap-2.5 animate-float'
                                    style={{ animationDelay: '1s' }}
                                >
                                    <div className='w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center'>
                                        <Wind className='w-4 h-4 text-slate-700' />
                                    </div>
                                    <div>
                                        <div className='text-xs text-slate-500'>Top Speed</div>
                                        <div className='text-sm font-bold text-slate-900'>
                                            35km/h
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 animate-bounce'>
                    <div className='w-5 h-8 rounded-full border-2 border-slate-700 flex items-start justify-center pt-1.5'>
                        <div className='w-1 h-2 rounded-full bg-slate-500' />
                    </div>
                </div>
            </section>

            {/* ═══ MARQUEE BAR ══════════════════════════════════ */}
            <section className='bg-green-500 py-4 overflow-hidden'>
                <div className='flex animate-marquee whitespace-nowrap'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <span
                            key={i}
                            className='flex items-center gap-8 mx-8 text-white font-semibold text-sm'
                        >
                            <span>⚡ Beat Lagos Traffic</span>
                            <span>•</span>
                            <span>🔋 60km+ Range</span>
                            <span>•</span>
                            <span>🛠 Expert Servicing</span>
                            <span>•</span>
                            <span>🇳🇬 Nigerian Owned</span>
                            <span>•</span>
                            <span>✅ 1 Year Warranty</span>
                            <span>•</span>
                        </span>
                    ))}
                </div>
            </section>

            {/* ═══ VIDEO SECTION (if configured) ════════════════════ */}
            {videoSettings.hero_video_url && (
                <HomepageVideoSection
                    videoUrl={videoSettings.hero_video_url}
                    poster={videoSettings.hero_video_poster || undefined}
                    title={videoSettings.hero_video_title}
                    subtitle={videoSettings.hero_video_subtitle}
                />
            )}

            {/* ═══ FEATURED BIKES ═══════════════════════════════ */}
            <section className='jv-section bg-white'>
                <div className='jv-container'>
                    <div className='flex items-end justify-between mb-12'>
                        <div>
                            <p className='text-green-500 font-semibold text-sm uppercase tracking-wider mb-2'>
                                Our Collection
                            </p>
                            <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900'>
                                Featured eBikes
                            </h2>
                        </div>
                        <Link
                            href='/shop'
                            className='hidden md:flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-green-500 transition-colors'
                        >
                            View All <ChevronRight className='w-4 h-4' />
                        </Link>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {bikes.map((bike, i) => (
                            <Link
                                key={bike.id}
                                href={`/shop/${bike.slug}`}
                                className='group jv-card overflow-hidden'
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {/* Image */}
                                <div className='relative aspect-[4/3] bg-slate-50 overflow-hidden rounded-t-3xl'>
                                    <div className='absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500'>
                                        🚴
                                    </div>
                                    {bike.salePrice && (
                                        <div className='absolute top-3 left-3 jv-badge bg-red-500 text-white'>
                                            SALE
                                        </div>
                                    )}
                                    {bike.featured && (
                                        <div className='absolute top-3 right-3 jv-badge bg-slate-900 text-white'>
                                            Featured
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className='p-5'>
                                    <p className='text-xs font-medium text-slate-400 uppercase tracking-wider mb-1'>
                                        {bike.category.replace('_', ' ')}
                                    </p>
                                    <h3 className='font-bold text-slate-900 text-base mb-2 group-hover:text-green-600 transition-colors line-clamp-1'>
                                        {bike.name}
                                    </h3>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <span className='text-xl font-extrabold text-slate-900'>
                                                {formatNaira(Number(bike.price))}
                                            </span>
                                            {bike.salePrice && (
                                                <span className='text-sm text-slate-400 line-through ml-2'>
                                                    {formatNaira(Number(bike.salePrice))}
                                                </span>
                                            )}
                                        </div>
                                        <div className='w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-green-500 transition-colors'>
                                            <ArrowRight className='w-4 h-4 text-white' />
                                        </div>
                                    </div>
                                    {bike.stock < 5 && bike.stock > 0 && (
                                        <p className='text-xs text-orange-500 font-medium mt-2'>
                                            Only {bike.stock} left in stock
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className='mt-8 text-center md:hidden'>
                        <Link href='/shop' className='jv-btn-secondary'>
                            View All Bikes
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ WHY JOVICO ═══════════════════════════════════ */}
            <section className='jv-section bg-slate-50'>
                <div className='jv-container'>
                    <div className='text-center mb-14'>
                        <p className='text-green-500 font-semibold text-sm uppercase tracking-wider mb-2'>
                            Why Choose Us
                        </p>
                        <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900'>
                            Built for Lagos.
                            <br />
                            Built to Last.
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {[
                            {
                                icon: Shield,
                                title: '1 Year Full Warranty',
                                desc: 'Every Jovico bike comes with a comprehensive 1-year warranty covering motor, battery, and frame. We stand behind our products.',
                                color: 'bg-blue-50 text-blue-600',
                            },
                            {
                                icon: Wrench,
                                title: 'Expert Technicians',
                                desc: 'Our certified eBike mechanics are trained on all major platforms. From Bosch to Bafang — we fix it right the first time.',
                                color: 'bg-green-50 text-green-600',
                            },
                            {
                                icon: MapPin,
                                title: 'Lagos Specialists',
                                desc: 'We know Lagos roads. Our bikes are selected and tuned for Nigerian terrain, weather, and riding conditions.',
                                color: 'bg-orange-50 text-orange-600',
                            },
                            {
                                icon: Zap,
                                title: 'Premium Components',
                                desc: 'Shimano gears, Hydraulic brakes, Samsung/LG battery cells — we never cut corners on the parts that matter.',
                                color: 'bg-purple-50 text-purple-600',
                            },
                            {
                                icon: Clock,
                                title: 'Fast Turnaround',
                                desc: 'Most service jobs completed within 24-48 hours. We value your time as much as you do.',
                                color: 'bg-slate-100 text-slate-700',
                            },
                            {
                                icon: Users,
                                title: 'Community of Riders',
                                desc: 'Join hundreds of Lagos riders on our community rides, online group, and exclusive members benefits.',
                                color: 'bg-pink-50 text-pink-600',
                            },
                        ].map((feature) => (
                            <div key={feature.title} className='jv-card p-7 flex gap-5'>
                                <div
                                    className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center shrink-0`}
                                >
                                    <feature.icon className='w-6 h-6' />
                                </div>
                                <div>
                                    <h3 className='font-bold text-slate-900 mb-2'>
                                        {feature.title}
                                    </h3>
                                    <p className='text-slate-500 text-sm leading-relaxed'>
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SERVICES PREVIEW ══════════════════════════════ */}
            <section className='jv-section bg-white'>
                <div className='jv-container'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center'>
                        {/* Left: Content */}
                        <div>
                            <p className='text-green-500 font-semibold text-sm uppercase tracking-wider mb-2'>
                                Expert Servicing
                            </p>
                            <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-5'>
                                Keep Your Ride in Peak Condition
                            </h2>
                            <p className='text-slate-500 text-lg leading-relaxed mb-8'>
                                Our workshop is equipped with the latest eBike diagnostic tools.
                                Whether it's a basic tune-up or a full motor overhaul — our
                                certified technicians have you covered.
                            </p>

                            <div className='space-y-3 mb-8'>
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className='flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle2 className='w-5 h-5 text-green-500 shrink-0' />
                                            <div>
                                                <div className='font-semibold text-slate-900 text-sm'>
                                                    {service.name}
                                                </div>
                                                <div className='text-xs text-slate-500'>
                                                    {service.duration}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text-slate-900 font-bold text-sm'>
                                            {formatNaira(Number(service.price))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link href='/services' className='jv-btn-primary'>
                                View All Services <ArrowRight className='w-4 h-4' />
                            </Link>
                        </div>

                        {/* Right: Workshop image placeholder */}
                        <div className='relative'>
                            <div className='aspect-square max-w-lg mx-auto rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-700 overflow-hidden flex items-center justify-center'>
                                <div className='text-center text-white'>
                                    <div className='text-5xl sm:text-8xl mb-4'>🔧</div>
                                    <p className='font-semibold text-lg'>Expert Workshop</p>
                                    <p className='text-slate-400 text-sm'>
                                        Lagos's Best eBike Technicians
                                    </p>
                                </div>
                            </div>

                            {/* Stat card — hidden on mobile, shown md+ */}
                            <div className='hidden md:block absolute -bottom-6 -left-6 bg-white rounded-3xl shadow-xl p-5 sm:p-6 border border-slate-100'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center'>
                                        <Award className='w-6 h-6 text-green-600' />
                                    </div>
                                    <div>
                                        <div className='text-2xl font-extrabold text-slate-900'>
                                            500+
                                        </div>
                                        <div className='text-sm text-slate-500'>Bikes Serviced</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ TESTIMONIALS ══════════════════════════════════ */}
            <section className='jv-section bg-slate-950'>
                <div className='jv-container'>
                    <div className='text-center mb-14'>
                        <p className='text-green-400 font-semibold text-sm uppercase tracking-wider mb-2'>
                            Testimonials
                        </p>
                        <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-white'>
                            What Our Riders Say
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {[
                            {
                                name: 'Emeka Okafor',
                                role: 'Daily Commuter, Ikeja',
                                quote: "I cut my commute from 90 minutes to 25 minutes. The Jovico City Cruiser is the best investment I've made. Zero fuel costs too!",
                                rating: 5,
                            },
                            {
                                name: 'Adaeze Nwosu',
                                role: 'Food Delivery, VI',
                                quote: 'The Cargo Runner handles everything I throw at it. And when I had an issue with the battery, the Jovico team fixed it same day. Incredible service.',
                                rating: 5,
                            },
                            {
                                name: 'Tunde Adewale',
                                role: 'Tech Professional, Lekki',
                                quote: 'Bought the Street Glide S1 six months ago. Best purchase of the year. The team at Jovico knows their stuff and the after-sales support is excellent.',
                                rating: 5,
                            },
                        ].map((testimonial) => (
                            <div
                                key={testimonial.name}
                                className='bg-slate-800/50 rounded-3xl p-7 border border-slate-700/50'
                            >
                                <div className='flex mb-4'>
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className='w-4 h-4 text-yellow-400 fill-yellow-400'
                                        />
                                    ))}
                                </div>
                                <p className='text-slate-300 leading-relaxed mb-6 text-sm'>
                                    "{testimonial.quote}"
                                </p>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-sm'>
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className='text-white font-semibold text-sm'>
                                            {testimonial.name}
                                        </div>
                                        <div className='text-slate-500 text-xs'>
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ BLOG PREVIEW ═════════════════════════════════ */}
            {posts.length > 0 && (
                <section className='jv-section bg-white'>
                    <div className='jv-container'>
                        <div className='flex items-end justify-between mb-12'>
                            <div>
                                <p className='text-green-500 font-semibold text-sm uppercase tracking-wider mb-2'>
                                    From the Blog
                                </p>
                                <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900'>
                                    Riding Insights
                                </h2>
                            </div>
                            <Link
                                href='/blog'
                                className='hidden md:flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-green-500 transition-colors'
                            >
                                All Articles <ChevronRight className='w-4 h-4' />
                            </Link>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className='group jv-card overflow-hidden'
                                >
                                    <div className='aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl rounded-t-3xl'>
                                        📖
                                    </div>
                                    <div className='p-6'>
                                        <div className='flex items-center gap-2 mb-3'>
                                            <span className='jv-badge bg-slate-100 text-slate-600 text-xs'>
                                                {post.category}
                                            </span>
                                            <span className='text-xs text-slate-400'>
                                                {post.readTime} min read
                                            </span>
                                        </div>
                                        <h3 className='font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2'>
                                            {post.title}
                                        </h3>
                                        <p className='text-slate-500 text-sm line-clamp-2 mb-4'>
                                            {post.excerpt}
                                        </p>
                                        <div className='flex items-center justify-between text-xs text-slate-400'>
                                            <span>
                                                {post.publishedAt
                                                    ? formatDate(post.publishedAt)
                                                    : ''}
                                            </span>
                                            <span className='text-green-500 font-semibold group-hover:gap-2 flex items-center gap-1 transition-all'>
                                                Read more <ArrowRight className='w-3.5 h-3.5' />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ ROI CALCULATOR ════════════════════════════════ */}
            <EBikeROICalculator />

            {/* ═══ CTA BANNER ═══════════════════════════════════ */}
            <section className='py-20 bg-green-500'>
                <div className='jv-container text-center'>
                    <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5'>
                        Ready to Ride Electric?
                    </h2>
                    <p className='text-green-100 text-lg mb-8 max-w-xl mx-auto'>
                        Visit our Victoria Island showroom or browse online. Test rides available by
                        appointment.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Link
                            href='/shop'
                            className='inline-flex items-center justify-center gap-2 rounded-full bg-white text-green-700 font-bold px-8 py-4 text-base hover:bg-green-50 transition-colors'
                        >
                            Shop Now <ArrowRight className='w-5 h-5' />
                        </Link>
                        <Link
                            href='/contact'
                            className='inline-flex items-center justify-center gap-2 rounded-full bg-transparent text-white font-bold px-8 py-4 text-base border-2 border-white/50 hover:border-white hover:bg-white/10 transition-colors'
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
