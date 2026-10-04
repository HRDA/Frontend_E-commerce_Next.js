import Link from "next/link";
import { getServerSession, logoutAction } from "@/app/actions/auth";
import { CartBadge } from "@/components/CartBadge";

export async function Header() {
  const user = await getServerSession();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
          E-commerce Laravel
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/" className="hover:text-slate-900">Inicio</Link>
          <Link href="/historial" className="hover:text-slate-900">Historial</Link>
        </nav>

        <div className="flex items-center gap-3">
          <CartBadge />
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/historial" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                {user.name}
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Cerrar sesión
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Iniciar sesión
              </Link>
              <Link href="/register" className="rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
