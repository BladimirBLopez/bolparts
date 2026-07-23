import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const { sellerId, rating, comment } = await req.json();

  if (!sellerId || !rating) {
    return Response.json({ error: "Faltan datos" }, { status: 400 });
  }

  if (sellerId === session.user.id) {
    return Response.json(
      { error: "No podés calificarte a vos mismo" },
      { status: 400 }
    );
  }

  const ratingNum = parseInt(rating);
  if (ratingNum < 1 || ratingNum > 5) {
    return Response.json({ error: "Calificación inválida" }, { status: 400 });
  }

  const review = await prisma.review.upsert({
    where: {
      authorId_sellerId: {
        authorId: session.user.id,
        sellerId,
      },
    },
    update: {
      rating: ratingNum,
      comment: comment || null,
    },
    create: {
      authorId: session.user.id,
      sellerId,
      rating: ratingNum,
      comment: comment || null,
    },
  });

  return Response.json({ ok: true, review });
}
