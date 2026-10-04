export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";
export const STORE_CURRENCY = "USD";

export function formatCurrency(value: number | string, currency = STORE_CURRENCY): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(value) || 0);
}

export type Product = {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  price: string | number;
  stock: number;
  in_stock: boolean;
  is_active?: boolean;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

export type OrderSummary = {
  id: number;
  status: string;
  total_amount: string | number;
  currency?: string;
  created_at?: string;
  items?: Array<{
    product_id: number;
    product_name?: string;
    quantity: number;
    subtotal?: string | number;
    unit_price?: string | number;
  }>;
};

export type OrderDetails = OrderSummary & {
  currency: string;
  payment?: {
    status: string;
    client_secret: string | null;
    stripe_payment_intent_id: string;
  } | null;
};

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products?per_page=100`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
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

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload?.data ?? payload ?? null;
  } catch {
    return null;
  }
}
