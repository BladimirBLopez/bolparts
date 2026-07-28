import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Star, ChevronRight } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MyListingCard } from "@/components/MyListingCard";

export default async function MisPublicacionesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [listings, usuario] = await Promise.all([
    prisma.listing.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { images: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { nivelPlan: true },
    }),
  ]);

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
            Mis publicaciones
          </h1>
          <Link
            href="/vender"
            className="flex items-center gap-1.5 rounded-full bg-[#FF5A1F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16]"
          >
            <Plus size={16} />
            Nueva
          </Link>
        </div>

        {usuario?.nivelPlan === "NINGUNO" && (
          <Link
            href="/planes"
            className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#16181D] px-5 py-4 text-white transition-colors hover:bg-[#232631]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF5A1F]">
                <Star size={16} fill="currentColor" />
              </span>
              <div>
                <p className="text-sm font-semibold">Destacá tus repuestos</p>
                <p className="text-xs text-white/60">
                  Aparecé primero en búsquedas y home
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="shrink-0 text-white/60" />
          </Link>
        )}

        {listings.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E4E1] bg-white py-16 text-center">
            <p className="text-sm font-semibold text-[#16181D]">
              Todavía no publicaste ningún repuesto
            </p>
            <Link
              href="/vender"
              className="mt-2 rounded-full bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Vender mi primer repuesto
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {listings.map((listing) => (
              <MyListingCard
                key={listing.id}
                id={listing.id}
                slug={listing.slug}
                title={listing.title}
                price={listing.price}
                condition={listing.condition}
                city={listing.city}
                imageUrl={listing.images[0]?.url}
                vistas={listing.vistas}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
