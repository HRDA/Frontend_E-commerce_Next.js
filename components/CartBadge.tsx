"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export function CartBadge() {
  const { itemCount } = useCart();

  return (
    <Link href="/checkout" className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50">
      Carrito
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-600 px-1 text-xs font-bold text-white">
        {itemCount}
      </span>
    </Link>
  );
}
