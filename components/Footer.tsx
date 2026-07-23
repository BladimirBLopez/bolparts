import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#E4E4E1] bg-white px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-xs text-[#6B7280] sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} BolParts. Repuestos de auto en Bolivia.</p>
        <div className="flex items-center gap-4">
          <Link href="/terminos" className="hover:text-[#16181D]">
            Términos y condiciones
          </Link>
          <Link href="/privacidad" className="hover:text-[#16181D]">
            Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
