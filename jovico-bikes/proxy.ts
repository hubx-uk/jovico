// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { verifyCustomerToken } from '@/lib/customerAuth'

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl

    // ── Admin routes ────────────────────────────────────────
    if (pathname.startsWith('/admin')) {
        if (pathname.startsWith('/admin/login')) return NextResponse.next()

        const token = req.cookies.get('jovico_admin_session')?.value
        if (!token) {
            const url = new URL('/admin/login', req.url)
            url.searchParams.set('from', pathname)
            return NextResponse.redirect(url)
        }
        const session = await verifyToken(token)
        if (!session) {
            const url = new URL('/admin/login', req.url)
            url.searchParams.set('from', pathname)
            return NextResponse.redirect(url)
        }
        return NextResponse.next()
    }

    // ── Customer account routes ─────────────────────────────
    if (pathname.startsWith('/account')) {
        // Allow login and register pages through
        if (pathname === '/account/login' || pathname === '/account/register') {
            return NextResponse.next()
        }

        const token = req.cookies.get('jovico_customer_session')?.value
        if (!token) {
            const url = new URL('/account/login', req.url)
            url.searchParams.set('from', pathname)
            return NextResponse.redirect(url)
        }
        const session = await verifyCustomerToken(token)
        if (!session) {
            const url = new URL('/account/login', req.url)
            url.searchParams.set('from', pathname)
            return NextResponse.redirect(url)
        }
        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/account/:path*'],
}
