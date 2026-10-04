"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatCurrency, type Product } from "@/lib/backend";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-52 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6 text-3xl font-bold text-slate-500">
        {product.name.slice(0, 1).toUpperCase()}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{product.stock} disponibles</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700">
            {formatCurrency(product.price)}
          </span>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {product.description || "Sin descripción disponible."}
        </p>

        <div className="mt-auto flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Ver detalle
          </Link>
          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={!product.in_stock}
            className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {product.in_stock ? "Añadir" : "Sin stock"}
          </button>
        </div>
      </div>
    </article>
  );
}
