
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import slugify from 'slugify'
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function createSlug(text: string): string {
    return slugify(text, { lower: true, strict: true })
}

export function formatNaira(amount: number | string): string {
    const num = typeof amount === 'string' ? Number.parseFloat(amount) : amount
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(num)
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('en-NG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date))
}

export function truncate(str: string, len: number): string {
    if (str.length <= len) return str
    return `${str.slice(0, len)}...`
}

export function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `JVB-${timestamp}-${random}`
}

export function getReadTime(content: string): number {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.ceil(words / 200)
}

// Configuration constants
const ITERATIONS = 100000 // Higher = more secure but slower
const KEY_LENGTH = 64 // Length of derived key in bytes
const DIGEST = 'sha512' // Hashing algorithm

/**
 * Hash a password with a randomly generated salt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The stored hash in format: salt:hash
 */
export async function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (typeof password !== 'string' || password.length === 0) {
            return reject(new Error('Password must be a non-empty string.'))
        }

        const salt = crypto.randomBytes(16).toString('hex') // Generate salt
        crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
            if (err) return reject(err)
            resolve(`${salt}:${derivedKey.toString('hex')}`)
        })
    })
}

/**
 * Compare a plain password with a stored salt:hash string.
 * @param {string} password - The plain text password.
 * @param {string} storedHash - The stored salt:hash string.
 * @returns {Promise<boolean>} - True if match, false otherwise.
 */
export async function comparePasswords(password: string, storedHash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if (typeof password !== 'string' || typeof storedHash !== 'string') {
            return reject(new Error('Invalid arguments.'))
        }

        const [salt, key] = storedHash.split(':')
        if (!salt || !key) {
            return reject(new Error('Stored hash format is invalid.'))
        }

        crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
            if (err) return reject(err)
            // Use timingSafeEqual to prevent timing attacks
            const match = crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey)
            resolve(match)
        })
    })
}
