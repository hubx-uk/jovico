// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const ADMIN_PREFIX = '/admin'
const PUBLIC_ADMIN_PATHS = ['/admin/login']

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Only guard /admin routes
    if (!pathname.startsWith(ADMIN_PREFIX)) {
        return NextResponse.next()
    }

    // Allow login page through
    if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
        return NextResponse.next()
    }

    const token = req.cookies.get('jovico_admin_session')?.value

    if (!token) {
        const loginUrl = new URL('/admin/login', req.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    const session = await verifyToken(token)
    if (!session) {
        const loginUrl = new URL('/admin/login', req.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
