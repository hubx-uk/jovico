import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import path from 'path'
import fs from 'fs'

// Max file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/ogg']

export async function POST(req: NextRequest) {
        try {
                const formData = await req.formData()
                const file = formData.get('video') as File

                if (!file) {
                        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
                }

                // Validate file type
                if (!ALLOWED_TYPES.includes(file.type)) {
                        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
                }

                // Validate file size
                if (file.size > MAX_FILE_SIZE) {
                        return NextResponse.json({ error: 'File too large' }, { status: 400 })
                }

                // Convert file to buffer
                const bytes = await file.arrayBuffer()
                const buffer = Buffer.from(bytes)

                // Ensure uploads directory exists
                const uploadDir = path.join(process.cwd(), 'public', 'uploads')
                if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true })
                }

                // Save file
                const filePath = path.join(uploadDir, file.name)
                fs.writeFileSync(filePath, buffer)

                return NextResponse.json({
                        message: 'Upload successful',
                        url: `/uploads/${file.name}`,
                })
        } catch (error) {
                console.error('Upload error:', error)
                return NextResponse.json({ error: 'Server error' }, { status: 500 })
        }
}
