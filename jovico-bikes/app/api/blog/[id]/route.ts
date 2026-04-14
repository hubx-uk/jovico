// app/api/blog/[id]/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSlug, getReadTime } from '@/lib/utils'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(post)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAuth()
        const { id } = await params
        const body = await req.json()
        const { title, content, published, ...rest } = body

        const existing = await prisma.post.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const post = await prisma.post.update({
            where: { id },
            data: {
                ...(title ? { title, slug: createSlug(title) } : {}),
                ...(content ? { content, readTime: getReadTime(content) } : {}),
                ...(published !== undefined
                    ? {
                          published,
                          publishedAt:
                              published && !existing.publishedAt
                                  ? new Date()
                                  : existing.publishedAt,
                      }
                    : {}),
                ...rest,
            },
        })
        return NextResponse.json(post)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAuth()
        const { id } = await params
        await prisma.post.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
