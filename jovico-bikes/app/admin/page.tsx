// app/admin/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingBag, FileText, ShoppingCart, Mail, TrendingUp,
  ArrowUpRight, Clock, CheckCircle2, XCircle, Package,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatNaira, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const [
    productCount,
    orderCount,
    postCount,
    messageCount,
    recentOrders,
    recentMessages,
    pendingBookings,
    revenue,
  ] = await Promise.all([
    prisma.product.count({ where: { published: true } }),
    prisma.order.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: { take: 1 } },
    }),
    prisma.contactMessage.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      where: { read: false },
    }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
  ]);

  const totalRevenue = Number(revenue._sum.total ?? 0);

  const stats = [
    {
      label: "Total Revenue",
      value: formatNaira(totalRevenue),
      icon: TrendingUp,
      sub: "From paid orders",
      color: "bg-green-50 text-green-600",
      href: "/admin/orders",
    },
    {
      label: "Orders",
      value: orderCount.toString(),
      icon: ShoppingCart,
      sub: "All time",
      color: "bg-blue-50 text-blue-600",
      href: "/admin/orders",
    },
    {
      label: "Products",
      value: productCount.toString(),
      icon: ShoppingBag,
      sub: "Active listings",
      color: "bg-slate-100 text-slate-700",
      href: "/admin/shop",
    },
    {
      label: "Blog Posts",
      value: postCount.toString(),
      icon: FileText,
      sub: "Published",
      color: "bg-purple-50 text-purple-600",
      href: "/admin/blog",
    },
    {
      label: "Unread Messages",
      value: messageCount.toString(),
      icon: Mail,
      sub: "Needs attention",
      color: "bg-orange-50 text-orange-600",
      href: "/admin/enquiries",
    },
    {
      label: "Pending Bookings",
      value: pendingBookings.toString(),
      icon: Clock,
      sub: "Awaiting confirmation",
      color: "bg-red-50 text-red-600",
      href: "/admin/bookings",
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back. Here's what's happening at Jovico today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all group"
          >
            <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-slate-500">{stat.label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm truncate">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-slate-400">{order.orderNumber}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-slate-900 text-sm">
                      {formatNaira(Number(order.total))}
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Unread Messages */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Unread Messages</h2>
            <Link href="/admin/enquiries" className="text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">All caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href={`/admin/enquiries`}
                  className="block px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                      {msg.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-slate-900 text-sm">{msg.name}</span>
                        <span className="text-[11px] text-slate-400">{formatDate(msg.createdAt)}</span>
                      </div>
                      <div className="text-xs font-medium text-slate-600 mb-0.5">{msg.subject}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{msg.message}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Product", href: "/admin/shop/new", icon: "＋ 🚴" },
            { label: "New Blog Post", href: "/admin/blog/new", icon: "＋ 📝" },
            { label: "View Orders", href: "/admin/orders", icon: "📦" },
            { label: "Check Bookings", href: "/admin/bookings", icon: "📅" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-center"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-semibold text-slate-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
