// app/(main)/cart/page.tsx
import { getSettings } from '@/lib/getSettings'
import { CartClient } from '@/components/shop/CartClient'

export default async function CartPage() {
    const settings = await getSettings(['whatsapp'])
    return <CartClient whatsapp={settings.whatsapp} />
}
