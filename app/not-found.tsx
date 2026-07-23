import Link from "next/link";
import { SearchX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#F6F6F4] px-4 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#16181D]">
        <SearchX size={28} />
      </span>

      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[#16181D]">
        No encontramos esta página
      </h1>
      <p className="mt-2 max-w-sm text-sm text-[#6B7280]">
        Puede que el repuesto ya se haya vendido o que el link esté mal
        escrito.
      </p>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16]"
        >
          <Home size={16} />
          Ir al inicio
        </Link>
        <Link
          href="/buscar"
          className="flex items-center justify-center gap-2 rounded-full border border-[#E4E4E1] bg-white px-6 py-3 text-sm font-semibold text-[#16181D] transition-colors hover:border-[#16181D]"
        >
          Buscar repuestos
        </Link>
      </div>
    </main>
  );
}
