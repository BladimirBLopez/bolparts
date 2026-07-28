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

  const isOwner = listing.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
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
      yearFrom,
      yearTo,
      phone,
      categoryId,
      brandId,
      modelId,
      images,
      numeroParte,
      compatibilidades,
      peso,
      largo,
      alto,
      ancho,
    } = body;

    if (!title || !price || !condition || !city || !categoryId) {
      return Response.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const precioNum = parseFloat(price);
    if (isNaN(precioNum) || precioNum <= 0) {
      return Response.json(
        { error: "El precio debe ser un número válido mayor a 0" },
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
    await prisma.compatibilidad.deleteMany({ where: { listingId: id } });

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        title,
        description: description || null,
        price: precioNum,
        condition,
        city,
        department: city,
        yearFrom: yearFrom ? parseInt(yearFrom) : null,
        yearTo: yearTo ? parseInt(yearTo) : null,
        phone: phone || null,
        numeroParte: numeroParte || null,
        peso: peso ? parseFloat(peso) : null,
        largo: largo ? parseFloat(largo) : null,
        alto: alto ? parseFloat(alto) : null,
        ancho: ancho ? parseFloat(ancho) : null,
        categoryId,
        brandId: brandId || null,
        modelId: modelId || null,
        images: {
          create: images.map((url: string) => ({ url })),
        },
        compatibilidades: {
          create: Array.isArray(compatibilidades)
            ? compatibilidades.map(
                (c: {
                  brandId?: string;
                  modelId?: string;
                  yearFrom?: string;
                  yearTo?: string;
                }) => ({
                  brandId: c.brandId || null,
                  modelId: c.modelId || null,
                  yearFrom: c.yearFrom ? parseInt(c.yearFrom) : null,
                  yearTo: c.yearTo ? parseInt(c.yearTo) : null,
                })
              )
            : [],
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
