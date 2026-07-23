import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const { listingId } = await req.json();
  if (!listingId) {
    return Response.json({ error: "Falta listingId" }, { status: 400 });
  }

  const existente = await prisma.favorite.findUnique({
    where: {
      userId_listingId: {
        userId: session.user.id,
        listingId,
      },
    },
  });

  if (existente) {
    await prisma.favorite.delete({ where: { id: existente.id } });
    return Response.json({ ok: true, favorited: false });
  }

  await prisma.favorite.create({
    data: { userId: session.user.id, listingId },
  });
  return Response.json({ ok: true, favorited: true });
}
