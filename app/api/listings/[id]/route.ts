import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing) {
    return Response.json({ error: "Publicación no encontrada" }, { status: 404 });
  }

  if (listing.userId !== session.user.id) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  await prisma.image.deleteMany({ where: { listingId: id } });
  await prisma.favorite.deleteMany({ where: { listingId: id } });
  await prisma.listing.delete({ where: { id } });

  return Response.json({ ok: true });
}
