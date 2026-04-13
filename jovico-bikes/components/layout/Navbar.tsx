"use client";
// components/layout/Navbar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, Zap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "Accessories", href: "/accessories" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-sm"
          : "bg-transparent"
      )}
      style={{ height: "var(--nav-height)" }}
    >
      <nav className="jv-container flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            Jovico<span className="text-green-500">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "nav-link px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/shop"
            className="jv-btn-primary text-sm !px-5 !py-2.5"
          >
            Shop Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl rounded-b-3xl overflow-hidden animate-slide-in-right">
          <div className="jv-container py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center py-3 px-4 rounded-2xl text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/shop" className="jv-btn-primary w-full justify-center">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
