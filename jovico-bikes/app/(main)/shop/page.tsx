// app/(main)/shop/page.tsx
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/utils";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ProductCategory } from "@/prisma/generated/prisma/enums";

export const metadata: Metadata = {
  title: "Shop eBikes",
  description:
    "Browse the full Jovico Bikes collection. City bikes, mountain bikes, cargo bikes and folding bikes — all built for Lagos.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const params = await searchParams;
  const rawCategory = (params.category ?? "all").toLowerCase();
  const sort = params.sort ?? "featured";
  const query = params.q ?? "";

  const categoryFilter =
    rawCategory && rawCategory !== "all"
      ? { category: rawCategory.toUpperCase() as ProductCategory }
      : {};

  const products = await prisma.product.findMany({
    where: {
      published: true,
      type: "BIKE",
      ...categoryFilter,
      ...(query
        ? { OR: [{ name: { contains: query } }, { description: { contains: query } }] }
        : {}),
    },
    include: { images: { where: { isPrimary: true }, take: 1 } },
    orderBy:
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : sort === "newest"
            ? { createdAt: "desc" }
            : { featured: "desc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-12 bg-slate-950">
        <div className="jv-container">
          <p className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-2">
            Our Collection
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3">
            Shop eBikes
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-lg">
            Premium electric bikes for every Lagos lifestyle — from city commuter to off-road explorer.
          </p>
        </div>
      </section>

      {/* Filters (client component, wrapped in Suspense for streaming) */}
      <Suspense fallback={<div className="h-14 bg-white border-b border-slate-100" />}>
        <ShopFilters />
      </Suspense>

      {/* Products */}
      <section className="jv-section bg-slate-50">
        <div className="jv-container">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🚴</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No bikes found</h2>
              <p className="text-slate-500 mb-6">Try adjusting your filters or search term.</p>
              <Link href="/shop" className="jv-btn-primary">View All Bikes</Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-6">
                {products.length} bike{products.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="group jv-card overflow-hidden bg-white"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-slate-50 rounded-t-3xl overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-500">
                        🚴
                      </div>
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="jv-badge bg-slate-700 text-white text-xs">Out of Stock</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.salePrice && (
                          <span className="jv-badge bg-red-500 text-white text-xs">SALE</span>
                        )}
                        {product.featured && (
                          <span className="jv-badge bg-green-500 text-white text-xs">Popular</span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 sm:p-5">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                        {product.category.replace(/_/g, " ")}
                      </p>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1 group-hover:text-green-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2 hidden sm:block">
                        {product.description}
                      </p>

                      {/* Spec pills */}
                      {product.specs && typeof product.specs === "object" && (
                        <div className="hidden sm:flex gap-2 mb-3">
                          {Object.entries(product.specs as Record<string, string>)
                            .slice(0, 2)
                            .map(([key, val]) => (
                              <div
                                key={key}
                                className="flex-1 bg-slate-50 rounded-xl px-2.5 py-1.5 text-center min-w-0"
                              >
                                <div className="text-xs font-bold text-slate-900 truncate">{val}</div>
                                <div className="text-[10px] text-slate-400 capitalize truncate">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-base sm:text-lg font-extrabold text-slate-900">
                            {formatNaira(Number(product.price))}
                          </span>
                          {product.salePrice && (
                            <span className="text-xs text-slate-400 line-through ml-1.5">
                              {formatNaira(Number(product.salePrice))}
                            </span>
                          )}
                        </div>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 group-hover:bg-green-500 flex items-center justify-center transition-colors shrink-0">
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </div>
                      </div>

                      {product.stock > 0 && product.stock < 5 && (
                        <p className="text-xs text-orange-500 font-medium mt-2">
                          Only {product.stock} left
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
