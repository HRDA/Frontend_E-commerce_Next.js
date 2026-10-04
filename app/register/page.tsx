import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Registro</p>
          <h1 className="text-3xl font-bold text-slate-900">Crea tu cuenta</h1>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-slate-600">
          ¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-slate-900">Entra aquí</Link>
        </p>
      </div>
    </main>
  );
}
