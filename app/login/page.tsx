import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Acceso</p>
          <h1 className="text-3xl font-bold text-slate-900">Inicia sesión</h1>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-slate-600">
          ¿No tienes cuenta? <Link href="/register" className="font-semibold text-slate-900">Regístrate</Link>
        </p>
      </div>
    </main>
  );
}
