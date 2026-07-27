import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { accion } = body;

  if (!["APROBAR", "RECHAZAR"].includes(accion)) {
    return Response.json({ error: "Acción inválida" }, { status: 400 });
  }

  const solicitud = await prisma.solicitudPlan.findUnique({ where: { id } });
  if (!solicitud) {
    return Response.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }
  if (solicitud.estado !== "PENDIENTE") {
    return Response.json(
      { error: "Esta solicitud ya fue revisada" },
      { status: 400 }
    );
  }

  if (accion === "APROBAR") {
    const dias = 30;
    await prisma.$transaction([
      prisma.solicitudPlan.update({
        where: { id },
        data: { estado: "APROBADA", revisadaEn: new Date() },
      }),
      prisma.user.update({
        where: { id: solicitud.userId },
        data: {
          nivelPlan: solicitud.nivel,
          planExpiraEn: new Date(Date.now() + dias * 24 * 60 * 60 * 1000),
        },
      }),
    ]);
  } else {
    await prisma.solicitudPlan.update({
      where: { id },
      data: { estado: "RECHAZADA", revisadaEn: new Date() },
    });
  }

  return Response.json({ ok: true });
}
