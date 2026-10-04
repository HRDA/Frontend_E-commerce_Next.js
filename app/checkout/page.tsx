import { requireAuth } from "@/app/actions/auth";
import { CheckoutClient } from "@/components/CheckoutClient";

export default async function CheckoutPage() {
  await requireAuth();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Checkout</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Finaliza tu compra</h1>
      </div>
      <CheckoutClient />
    </main>
  );
}
