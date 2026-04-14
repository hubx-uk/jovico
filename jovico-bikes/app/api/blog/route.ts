// app/api/blog/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSlug, getReadTime } from '@/lib/utils'

const postSchema = z.object({
    title: z.string().min(5),
    excerpt: z.string().min(20),
    content: z.string().min(50),
    category: z.enum(['NEWS', 'TIPS', 'REVIEW', 'GUIDE', 'COMPANY']),
    tags: z.string().optional(),
    author: z.string().default('Jovico Team'),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    coverImage: z.string().optional(),
})

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const all = searchParams.get('all') === 'true' // admin view

    const posts = await prisma.post.findMany({
        where: all ? {} : { published: true },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
    try {
        await requireAuth()
        const body = await req.json()
        const data = postSchema.parse(body)
        const slug = createSlug(data.title)
        const readTime = getReadTime(data.content)

        const post = await prisma.post.create({
            data: {
                ...data,
                slug,
                readTime,
                publishedAt: data.published ? new Date() : null,
            },
        })
        return NextResponse.json(post, { status: 201 })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.errors }, { status: 400 })
        }
        if (err instanceof Error && err.message === 'Unauthorised') {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
