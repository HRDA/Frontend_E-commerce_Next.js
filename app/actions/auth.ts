"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { API_BASE_URL, User } from "@/lib/backend";

export type AuthState = {
  success: boolean;
  message: string;
  user?: User;
};

export async function loginAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { success: false, message: "Email y contraseña son obligatorios." };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: payload?.message ?? "No se pudo iniciar sesión.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("access_token", payload.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Number(payload.expires_in) || 3600,
    });

  } catch {
    return { success: false, message: "Error de conexión con la API." };
  }

  redirect("/");
}

export async function registerAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("password_confirmation") ?? "");

  if (!name || !email || !password) {
    return { success: false, message: "Nombre, email y contraseña son obligatorios." };
  }
  if (password !== passwordConfirmation) {
    return { success: false, message: "Las contraseñas no coinciden." };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: payload?.message ?? "No se pudo registrar al usuario.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("access_token", payload.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Number(payload.expires_in) || 3600,
    });

  } catch {
    return {
      success: false,
      message: "Error de conexión con la API.",
    };
  }

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  redirect("/");
}

export async function getServerSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      cookieStore.delete("access_token");
      return null;
    }

    const payload = await response.json();
    return payload?.data ?? null;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
