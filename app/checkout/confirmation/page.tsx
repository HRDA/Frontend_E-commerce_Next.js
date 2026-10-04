import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/app/actions/auth";
import { syncPaymentAction } from "@/app/actions/orders";

export default async function PaymentConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  await requireAuth();
  const { order_id: orderId } = await searchParams;

  if (!orderId || !/^[1-9]\d*$/.test(orderId)) {
    notFound();
  }

  const result = await syncPaymentAction(Number(orderId));

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {result.success && result.status === "paid" ? (
          <>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">Pago confirmado</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">¡Gracias por tu compra!</h1>
            <p className="mt-3 text-slate-600">El pedido #{orderId} está pagado.</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-700">Pago pendiente</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Estamos verificando tu pago</h1>
            <p className="mt-3 text-slate-600">
              {result.success
                ? `El estado actual del pedido es "${result.status}".`
                : result.message}
            </p>
            <Link
              href={`/checkout/payment/${orderId}`}
              className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Volver al pago
            </Link>
          </>
        )}

        {result.success && result.status === "paid" ? (
          <Link
            href="/historial"
            className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Ver mis pedidos
          </Link>
        ) : null}
      </section>
    </main>
  );
}
