import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/backend";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-10 rounded-[2rem] bg-slate-900 px-6 py-12 text-white shadow-lg md:px-10">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-300">E-commerce</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
          Productos modernos conectados a la API de Laravel
        </h1>
        <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">
          Descubre ofertas, compra de forma segura y consulta tu historial de pedidos desde el frontend de Next.js.
        </p>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Catálogo</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Productos destacados</h2>
          </div>
          <p className="text-sm text-slate-500">{products.length} artículos</p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
            No se pudieron cargar los productos. Revisa que la API de Laravel esté levantada en <span className="font-semibold">http://127.0.0.1:8000</span>.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
