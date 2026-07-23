import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/ListingCard";

export default async function FavoritosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const favoritos = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      listing: {
        include: { images: true, brand: true, model: true },
      },
    },
  });

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
          Favoritos
        </h1>

        {favoritos.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E4E1] bg-white py-16 text-center">
            <p className="text-sm font-semibold text-[#16181D]">
              Todavía no guardaste ningún repuesto
            </p>
            <p className="text-xs text-[#6B7280]">
              Tocá el corazón en cualquier publicación para guardarla acá.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {favoritos.map(({ listing }) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                condition={listing.condition}
                city={listing.city}
                imageUrl={listing.images[0]?.url}
                brandName={listing.brand?.name}
                modelName={listing.model?.name}
                loggedIn={true}
                initialFavorited={true}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
