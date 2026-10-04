import Link from "next/link";
import { requireAuth } from "@/app/actions/auth";
import { getOrders } from "@/app/actions/orders";
import { formatCurrency } from "@/lib/backend";

export default async function HistoryPage() {
  const user = await requireAuth();
  const orders = await getOrders();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Historial</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Tus pedidos</h1>
        </div>
        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Seguir comprando
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          {user.name}, todavía no tienes pedidos realizados.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Pedido #{order.id}</p>
                  <h2 className="text-xl font-semibold text-slate-900">{order.status}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(order.total_amount, order.currency ?? "USD")}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {order.items?.map((item, index) => (
                  <div key={`${order.id}-${index}`} className="flex items-center justify-between text-sm text-slate-600">
                    <span>{item.product_name ?? `Producto ${item.product_id}`} × {item.quantity}</span>
                    <span>{formatCurrency(item.subtotal ?? 0, order.currency ?? "USD")}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
