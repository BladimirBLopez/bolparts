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

export async function PATCH(
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

  try {
    const body = await req.json();
    const {
      title,
      description,
      price,
      condition,
      city,
      year,
      phone,
      categoryId,
      brandId,
      modelId,
      images,
    } = body;

    if (!title || !price || !condition || !city || !categoryId) {
      return Response.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (!images || images.length === 0) {
      return Response.json(
        { error: "Agregá al menos una foto" },
        { status: 400 }
      );
    }

    await prisma.image.deleteMany({ where: { listingId: id } });

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        title,
        description: description || null,
        price: parseFloat(price),
        condition,
        city,
        department: city,
        year: year ? parseInt(year) : null,
        phone: phone || null,
        categoryId,
        brandId: brandId || null,
        modelId: modelId || null,
        images: {
          create: images.map((url: string) => ({ url })),
        },
      },
    });

    return Response.json({ ok: true, listing: updated });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "No se pudo actualizar la publicación" },
      { status: 500 }
    );
  }
}
