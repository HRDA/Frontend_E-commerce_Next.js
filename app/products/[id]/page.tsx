import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/products/[id]/AddToCartButton";
import { formatCurrency, getProductById } from "@/lib/backend";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Volver al catálogo
        </Link>
      </div>

      <div className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_0.9fr] lg:p-10">
        <div className="flex h-[420px] items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 text-6xl font-bold text-slate-500">
          {product.name.slice(0, 1).toUpperCase()}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Producto</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700">
              {product.in_stock ? "En stock" : "Sin stock"}
            </span>
          </div>

          <p className="leading-7 text-slate-600">{product.description || "Producto sin descripción detallada."}</p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Stock disponible: <span className="font-semibold text-slate-900">{product.stock}</span>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}
