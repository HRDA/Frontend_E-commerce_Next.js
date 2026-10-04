import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderForPayment } from "@/app/actions/orders";
import { requireAuth } from "@/app/actions/auth";
import { PaymentClient } from "@/components/PaymentClient";
import { formatCurrency } from "@/lib/backend";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const result = await getOrderForPayment(id);

  if (!result.success) {
    if (result.notFound) {
      notFound();
    }

    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">No se pudo cargar el pago</h1>
          <p className="mt-3 text-sm text-rose-700">{result.message}</p>
          <Link
            href="/historial"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Ir a mis pedidos
          </Link>
        </section>
      </main>
    );
  }

  const { order } = result;
  const payment = order.payment;

  if (!payment) {
    throw new Error("La orden no tiene un pago asociado.");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/checkout" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Volver al carrito
        </Link>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Pago seguro</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Pedido #{order.id}</h1>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(order.total_amount, order.currency)}
          </p>
        </div>

        <div className="my-6 space-y-3">
          {order.items?.map((item, index) => (
            <div key={`${order.id}-${index}`} className="flex justify-between gap-4 text-sm text-slate-600">
              <span>{item.product_name ?? `Producto ${item.product_id}`} × {item.quantity}</span>
              <span>{formatCurrency(item.subtotal ?? 0, order.currency)}</span>
            </div>
          ))}
        </div>

        <PaymentClient
          orderId={order.id}
          clientSecret={payment.client_secret}
          status={order.status}
        />
      </section>
    </main>
  );
}
