import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { name, image, phone } = await req.json();

    if (!name || !name.trim()) {
      return Response.json({ error: "El nombre no puede estar vacío" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        image: image || null,
        phone: phone || null,
      },
      select: { id: true, name: true, image: true, phone: true, email: true },
    });

    return Response.json({ ok: true, user: updated });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "No se pudo actualizar el perfil" },
      { status: 500 }
    );
  }
}
