"use client";
// components/shop/AddToCartButton.tsx
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  product: { id: string; name: string; price: number; slug: string };
}

export function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    // Cart stored in localStorage for now; can be replaced with server-side cart
    const cart = JSON.parse(localStorage.getItem("jovico_cart") || "[]");
    const existing = cart.find((i: any) => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("jovico_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));

    setAdded(true);
    toast.success(`${product.name} added to cart!`, {
      description: "Ready to checkout whenever you are.",
    });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`flex-1 flex items-center justify-center gap-2 rounded-full font-semibold py-4 px-8 text-base transition-all duration-300 ${
        added
          ? "bg-green-500 text-white"
          : "bg-slate-900 text-white hover:bg-slate-800"
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" /> Added!
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" /> Add to Cart
        </>
      )}
    </button>
  );
}
