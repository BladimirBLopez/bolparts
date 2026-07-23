import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MyListingCard } from "@/components/MyListingCard";

export default async function MisPublicacionesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const listings = await prisma.listing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { images: true },
  });

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
            Mis publicaciones
          </h1>
          <Link
            href="/publicar"
            className="flex items-center gap-1.5 rounded-full bg-[#FF5A1F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16]"
          >
            <Plus size={16} />
            Nueva
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E4E1] bg-white py-16 text-center">
            <p className="text-sm font-semibold text-[#16181D]">
              Todavía no publicaste ningún repuesto
            </p>
            <Link
              href="/publicar"
              className="mt-2 rounded-full bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Publicar mi primer repuesto
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {listings.map((listing) => (
              <MyListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                condition={listing.condition}
                city={listing.city}
                imageUrl={listing.images[0]?.url}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
