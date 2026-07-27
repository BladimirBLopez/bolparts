import Link from "next/link";
import Image from "next/image";

const columnas = [
  {
    titulo: "Comprar",
    links: [
      { href: "/buscar", label: "Buscar repuestos" },
      { href: "/pedidos/nuevo", label: "Pedir un repuesto" },
      { href: "/favoritos", label: "Favoritos" },
    ],
  },
  {
    titulo: "Vender",
    links: [
      { href: "/vender", label: "Vender repuesto" },
      { href: "/mis-publicaciones", label: "Mis publicaciones" },
      { href: "/planes", label: "Destacar mi cuenta" },
    ],
  },
  {
    titulo: "Legal",
    links: [
      { href: "/terminos", label: "Términos y condiciones" },
      { href: "/privacidad", label: "Privacidad" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#E4E4E1] bg-white px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <Image
                src="/icon-header.png"
                alt="BolParts"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <span className="text-base font-extrabold tracking-tight text-[#16181D]">
                BOL Parts
              </span>
            </div>
            <p className="mt-2 text-xs text-[#6B7280]">
              Repuestos de auto, moto y camión en Bolivia. Sin intermediarios.
            </p>
          </div>

          {columnas.map((col) => (
            <div key={col.titulo}>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#16181D]">
                {col.titulo}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs text-[#6B7280] transition-colors hover:text-[#16181D]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-[#E4E4E1] pt-6 text-xs text-[#6B7280]">
          © {new Date().getFullYear()} BolParts. Repuestos de auto, moto y camión en Bolivia.
        </div>
      </div>
    </footer>
  );
}
