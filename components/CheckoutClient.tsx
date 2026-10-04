"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrderAction } from "@/app/actions/orders";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/backend";

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOrder = async () => {
    if (!items.length) {
      setMessage("Tu carrito está vacío.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const result = await createOrderAction(
      items.map((item) => ({ id: item.id, quantity: item.quantity })),
    );

    setIsSubmitting(false);

    if (!result.success) {
      setMessage(result.message ?? "No se pudo crear la orden.");
      return;
    }

    clearCart();
    router.push(`/checkout/payment/${result.orderId}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            Tu carrito está vacío.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-2xl font-bold text-slate-500">
                {item.name.slice(0, 1).toUpperCase()}
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                <p className="text-sm text-slate-500">{formatCurrency(item.price)} / unidad</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-9 w-9 rounded-full border border-slate-200 text-lg text-slate-700 hover:bg-slate-50"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium text-slate-800">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-9 w-9 rounded-full border border-slate-200 text-lg text-slate-700 hover:bg-slate-50"
                >
                  +
                </button>
              </div>

              <div className="min-w-[90px] text-right font-semibold text-slate-900">
                {formatCurrency(Number(item.price) * item.quantity)}
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Resumen</h2>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Envío</span>
            <span className="font-medium text-slate-900">{formatCurrency(0)}</span>
          </div>
          <div className="flex items-center justify-between pt-3 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>

        {message ? <p className="mt-4 text-sm text-rose-600">{message}</p> : null}

        <button
          type="button"
          onClick={handleCreateOrder}
          disabled={isSubmitting || items.length === 0}
          className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {isSubmitting ? "Procesando orden..." : "Confirmar compra"}
        </button>
      </aside>
    </div>
  );
}
