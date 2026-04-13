"use client";
// components/shop/EnquireButton.tsx
import { MessageCircle } from "lucide-react";

export function EnquireButton({ productName }: { productName: string }) {
  const whatsappUrl = `https://wa.me/2348012345678?text=Hi%20Jovico%20Bikes!%20I%27m%20interested%20in%20the%20${encodeURIComponent(productName)}.%20Could%20you%20tell%20me%20more?`;
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 text-slate-700 font-semibold py-4 px-8 text-base hover:border-green-500 hover:text-green-600 transition-colors"
    >
      <MessageCircle className="w-5 h-5" />
      Enquire
    </a>
  );
}
