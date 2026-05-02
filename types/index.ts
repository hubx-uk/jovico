// types/index.ts
// Centralised concrete types for the Jovico Bikes app
// All Prisma model shapes used in components are defined here so we never need `any`

import type { Order, OrderItem, ProductImage } from '@/prisma/generated/prisma/client'
import type {
    AdminRole,
    PostCategory,
    ProductCategory,
    ProductType,
} from '@/prisma/generated/prisma/enums'
import type { Decimal } from '@prisma/client/runtime/client'

// ─── Cart ──────────────────────────────────────────────────
export interface CartItem {
    id: string
    name: string
    price: number
    slug: string
    quantity: number
    image?: string
}

// ─── Product Editor ────────────────────────────────────────
export interface ProductEditorData {
    id: string
    name: string
    slug: string
    description: string
    price: Decimal | number | string
    salePrice: Decimal | number | string | null
    sku: string
    stock: number
    category: ProductCategory
    type: ProductType
    brand: string | null
    specs: Record<string, string> | null
    featured: boolean
    published: boolean
    images: ProductImage[]
}

export interface ProductFormState {
    name: string
    description: string
    price: string
    salePrice: string
    sku: string
    stock: number
    category: ProductCategory
    type: ProductType
    brand: string
    featured: boolean
    published: boolean
}

// ─── Service Editor ────────────────────────────────────────
export interface ServiceEditorData {
    id: string
    name: string
    slug: string
    shortDesc: string
    description: string
    price: Decimal | number | string | null
    priceNote: string | null
    duration: string | null
    icon: string | null
    featured: boolean
    published: boolean
    order: number
}

export interface ServiceFormState {
    name: string
    shortDesc: string
    description: string
    price: string
    priceNote: string
    duration: string
    icon: string
    featured: boolean
    published: boolean
    order: number
}

// ─── Blog Post Editor ──────────────────────────────────────
export interface PostEditorData {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    category: PostCategory
    tags: string | null
    author: string
    published: boolean
    featured: boolean
    coverImage: string | null
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    views: number
    readTime: number
}

export interface PostFormState {
    title: string
    excerpt: string
    content: string
    category: PostCategory
    tags: string
    author: string
    published: boolean
    featured: boolean
}

// ─── Order ─────────────────────────────────────────────────
export interface OrderWithItems extends Order {
    items: (OrderItem & {
        product: { name: string; slug: string; sku: string } | null
    })[]
}

export type ShippingAddress = {
    street: string
    city: string
    state: string
}

// ─── Admin session ─────────────────────────────────────────
export interface AdminSession {
    id: string
    email: string
    name: string
    role: AdminRole
}

// ─── Customer session ──────────────────────────────────────
export interface CustomerSession {
    id: string
    email: string
    name: string
}

// ─── Site settings ─────────────────────────────────────────
export interface SiteSettingsMap {
    site_name?: string
    tagline?: string
    phone?: string
    email?: string
    address?: string
    whatsapp?: string
    instagram?: string
    twitter?: string
    facebook?: string
    hero_video_url?: string
    hero_video_poster?: string
    hero_video_title?: string
    hero_video_subtitle?: string
}
