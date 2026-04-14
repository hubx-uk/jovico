import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))

import type * as runtime from '@prisma/client/runtime/client'
import * as $Class from './internal/class'
import * as Prisma from './internal/prismaNamespace'

export * as $Enums from './enums'
export * from './enums'
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Admins
 * const admins = await prisma.admin.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export const PrismaClient = $Class.getPrismaClientClass()
export type PrismaClient<
    LogOpts extends Prisma.LogLevel = never,
    OmitOpts extends Prisma.PrismaClientOptions['omit'] = Prisma.PrismaClientOptions['omit'],
    ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs,
> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>
export { Prisma }

/**
 * Model Admin
 *
 */
export type Admin = Prisma.AdminModel
/**
 * Model Product
 *
 */
export type Product = Prisma.ProductModel
/**
 * Model ProductImage
 *
 */
export type ProductImage = Prisma.ProductImageModel
/**
 * Model Service
 *
 */
export type Service = Prisma.ServiceModel
/**
 * Model Booking
 *
 */
export type Booking = Prisma.BookingModel
/**
 * Model Post
 *
 */
export type Post = Prisma.PostModel
/**
 * Model Order
 *
 */
export type Order = Prisma.OrderModel
/**
 * Model OrderItem
 *
 */
export type OrderItem = Prisma.OrderItemModel
/**
 * Model ContactMessage
 *
 */
export type ContactMessage = Prisma.ContactMessageModel
/**
 * Model Subscriber
 *
 */
export type Subscriber = Prisma.SubscriberModel
/**
 * Model SiteSetting
 *
 */
export type SiteSetting = Prisma.SiteSettingModel
