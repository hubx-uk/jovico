'use client'
// components/shop/EnquireButton.tsx
import { MessageCircle } from 'lucide-react'

interface Props {
    productName: string
    whatsapp?: string // digits only, e.g. "2348012345678"
}

export function EnquireButton({ productName, whatsapp = '2348012345678' }: Props) {
    const digits = whatsapp.replace(/\D/g, '')
    const url = `https://wa.me/${digits}?text=Hi%20Jovico%20Bikes!%20I%27m%20interested%20in%20the%20${encodeURIComponent(productName)}.%20Could%20you%20tell%20me%20more?`
    return (
        <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 text-slate-700 font-semibold py-4 px-8 text-base hover:border-green-500 hover:text-green-600 transition-colors'
        >
            <MessageCircle className='w-5 h-5' />
            Enquire
        </a>
    )
}
