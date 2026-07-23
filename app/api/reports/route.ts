import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const RAZONES_VALIDAS = ["FAKE", "SOLD", "INAPPROPRIATE", "SCAM", "OTHER"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const { listingId, reason, details } = await req.json();

  if (!listingId || !RAZONES_VALIDAS.includes(reason)) {
    return Response.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    return Response.json({ error: "Publicación no encontrada" }, { status: 404 });
  }

  const yaReportado = await prisma.report.findUnique({
    where: {
      reporterId_listingId: {
        reporterId: session.user.id,
        listingId,
      },
    },
  });

  if (yaReportado) {
    return Response.json({ ok: true, already: true });
  }

  await prisma.report.create({
    data: {
      reporterId: session.user.id,
      listingId,
      reason,
      details: details || null,
    },
  });

  return Response.json({ ok: true });
}
