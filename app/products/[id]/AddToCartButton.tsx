"use client";

import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/backend";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      disabled={!product.in_stock}
      className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {product.in_stock ? "Añadir al carrito" : "No disponible"}
    </button>
  );
}
