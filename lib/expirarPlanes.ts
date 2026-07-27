import { prisma } from "@/lib/prisma";

export async function expirarPlanesVencidos() {
  await prisma.user.updateMany({
    where: {
      nivelPlan: { not: "NINGUNO" },
      planExpiraEn: { lt: new Date() },
    },
    data: {
      nivelPlan: "NINGUNO",
      planExpiraEn: null,
    },
  });
}
