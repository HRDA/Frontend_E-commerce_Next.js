"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { API_BASE_URL, OrderDetails, OrderSummary } from "@/lib/backend";

export type CheckoutItem = {
  id: number;
  quantity: number;
};

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  return token;
}

async function parseResponse(response: Response): Promise<Record<string, unknown>> {
  const payload: unknown = await response.json();
  return typeof payload === "object" && payload !== null
    ? (payload as Record<string, unknown>)
    : {};
}

export async function createOrderAction(items: CheckoutItem[]) {
  const token = await getToken();

  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, message: "Tu carrito está vacío." };
  }

  const uniqueItems = new Set<number>();
  for (const item of items) {
    if (
      typeof item !== "object" ||
      item === null ||
      !Number.isSafeInteger(item.id) ||
      item.id < 1 ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      uniqueItems.has(item.id)
    ) {
      return { success: false, message: "El contenido del carrito no es válido." };
    }
    uniqueItems.add(item.id);
  }

  const payload = {
    items: items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    })),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        message:
          typeof data.message === "string"
            ? data.message
            : "No se pudo crear la orden.",
      };
    }

    const order = data.data;
    if (
      typeof order !== "object" ||
      order === null ||
      !("id" in order) ||
      typeof order.id !== "number"
    ) {
      return {
        success: false,
        message: "La API creó la orden, pero devolvió una respuesta inesperada.",
      };
    }

    return {
      success: true,
      orderId: order.id,
    };
  } catch {
    return { success: false, message: "Error de conexión con la API." };
  }
}

export async function getOrderForPayment(
  orderId: string,
): Promise<
  | { success: true; order: OrderDetails }
  | { success: false; message: string; notFound?: boolean }
> {
  const token = await getToken();

  if (!/^[1-9]\d*$/.test(orderId)) {
    return { success: false, message: "El número de pedido no es válido." };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    const payload = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        notFound: response.status === 404,
        message:
          typeof payload.message === "string"
            ? payload.message
            : "No se pudo consultar el pedido.",
      };
    }

    if (
      typeof payload.data !== "object" ||
      payload.data === null ||
      !("id" in payload.data) ||
      typeof payload.data.id !== "number"
    ) {
      return { success: false, message: "La API devolvió un pedido con formato inválido." };
    }

    return { success: true, order: payload.data as OrderDetails };
  } catch {
    return { success: false, message: "No se pudo conectar con la API para consultar el pedido." };
  }
}

async function postPay(orderId: number, confirmFakePayment: boolean) {
  const token = await getToken();

  if (!Number.isSafeInteger(orderId) || orderId < 1) {
    return { success: false as const, message: "El número de pedido no es válido." };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(confirmFakePayment ? { confirm: true } : {}),
      cache: "no-store",
    });
    const payload = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false as const,
        message:
          typeof payload.message === "string"
            ? payload.message
            : "No se pudo verificar el pago.",
      };
    }

    if (
      typeof payload.data !== "object" ||
      payload.data === null ||
      !("status" in payload.data) ||
      typeof payload.data.status !== "string"
    ) {
      return { success: false as const, message: "La API devolvió una respuesta de pago inválida." };
    }

    return { success: true as const, status: payload.data.status };
  } catch {
    return { success: false as const, message: "No se pudo conectar con la API de pagos." };
  }
}

export async function syncPaymentAction(orderId: number) {
  return postPay(orderId, false);
}

export async function confirmFakePaymentAction(orderId: number) {
  return postPay(orderId, true);
}

export async function getOrders(): Promise<OrderSummary[]> {
  const token = await getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch {
    return [];
  }
}
