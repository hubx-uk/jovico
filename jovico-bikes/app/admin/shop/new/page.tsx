// app/admin/shop/new/page.tsx
import type { Metadata } from "next";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const metadata: Metadata = { title: "New Product" };

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-8">Add New Product</h1>
      <ProductEditor product={null} mode="create" />
    </div>
  );
}
