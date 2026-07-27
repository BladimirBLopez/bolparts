import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { nivel, comprobanteUrl } = body;

  if (!["DESTACADO", "SUPERIOR"].includes(nivel)) {
    return Response.json({ error: "Nivel inválido" }, { status: 400 });
  }
  if (!comprobanteUrl) {
    return Response.json(
      { error: "Subí una foto del comprobante" },
      { status: 400 }
    );
  }

  const solicitudPendiente = await prisma.solicitudPlan.findFirst({
    where: { userId: session.user.id, estado: "PENDIENTE" },
  });
  if (solicitudPendiente) {
    return Response.json(
      { error: "Ya tenés una solicitud pendiente de revisión" },
      { status: 400 }
    );
  }

  const solicitud = await prisma.solicitudPlan.create({
    data: {
      nivel,
      comprobanteUrl,
      userId: session.user.id,
    },
  });

  return Response.json({ ok: true, solicitud });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const solicitudes = await prisma.solicitudPlan.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return Response.json({ ok: true, solicitudes });
}
