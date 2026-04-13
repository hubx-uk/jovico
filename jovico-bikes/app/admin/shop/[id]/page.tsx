// app/admin/shop/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!product) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-8">Edit Product</h1>
      <ProductEditor product={product as any} mode="edit" />
    </div>
  );
}
