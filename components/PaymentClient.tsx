"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { confirmFakePaymentAction, syncPaymentAction } from "@/app/actions/orders";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;
const fakePaymentMode =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_STRIPE_MODE === "fake";

type PaymentClientProps = {
  orderId: number;
  clientSecret: string | null;
  status: string;
};

export function PaymentClient({ orderId, clientSecret, status }: PaymentClientProps) {
  const [paid, setPaid] = useState(status === "paid");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFakePayment = async () => {
    setIsSubmitting(true);
    setMessage(null);
    const result = await confirmFakePaymentAction(orderId);
    setIsSubmitting(false);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setPaid(result.status === "paid");
    setMessage(
      result.status === "paid"
        ? null
        : `El pago todavía está en estado "${result.status}".`,
    );
  };

  if (paid) {
    return <PaymentComplete orderId={orderId} />;
  }

  return (
    <div className="space-y-5">
      {fakePaymentMode ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">Modo de pago local</p>
          <p className="mt-1 text-sm leading-6 text-amber-800">
            El backend usa su driver fake de Stripe. Este botón confirma el pago de prueba en Laravel;
            no se realizará ningún cargo.
          </p>
          <button
            type="button"
            onClick={handleFakePayment}
            disabled={isSubmitting}
            className="mt-4 w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Confirmando pago..." : "Confirmar pago de prueba"}
          </button>
        </div>
      ) : clientSecret && stripePromise ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: "stripe" },
          }}
        >
          <StripePaymentForm
            orderId={orderId}
            onPaid={() => setPaid(true)}
            onMessage={setMessage}
          />
        </Elements>
      ) : (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-800">
          El formulario de pago no está disponible. Configura
          {" "}NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY con la clave publicable de Stripe y asegúrate de que
          el backend use el driver `stripe`. El secreto privado de Stripe nunca debe ponerse aquí.
        </div>
      )}

      {message ? <p role="alert" className="text-sm text-rose-600">{message}</p> : null}
    </div>
  );
}

function StripePaymentForm({
  orderId,
  onPaid,
  onMessage,
}: {
  orderId: number;
  onPaid: () => void;
  onMessage: (message: string | null) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onMessage(null);

    if (!stripe || !elements) {
      onMessage("El formulario de Stripe todavía se está cargando.");
      return;
    }

    setIsSubmitting(true);
    const returnUrl = new URL("/checkout/confirmation", window.location.origin);
    returnUrl.searchParams.set("order_id", String(orderId));

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl.toString() },
      redirect: "if_required",
    });

    if (error) {
      onMessage(error.message ?? "Stripe no pudo confirmar el pago.");
      setIsSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const result = await syncPaymentAction(orderId);
      if (result.success && result.status === "paid") {
        onPaid();
      } else if (result.success) {
        onMessage(`Stripe recibió el pago; la orden se está actualizando (${result.status}).`);
      } else {
        onMessage(result.message);
      }
    } else {
      onMessage(
        paymentIntent
          ? `El pago quedó en estado "${paymentIntent.status}".`
          : "Stripe procesó la solicitud. Verifica el estado del pedido.",
      );
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Procesando pago..." : "Pagar de forma segura"}
      </button>
      <p className="text-center text-xs text-slate-500">
        El pago es procesado directamente por Stripe. No almacenamos datos de tarjeta.
      </p>
    </form>
  );
}

function PaymentComplete({ orderId }: { orderId: number }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
      <p className="text-lg font-semibold text-emerald-900">¡Pago confirmado!</p>
      <p className="mt-1 text-sm text-emerald-800">Tu pedido #{orderId} quedó pagado.</p>
      <Link
        href="/historial"
        className="mt-4 inline-flex rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
      >
        Ver mis pedidos
      </Link>
    </div>
  );
}

