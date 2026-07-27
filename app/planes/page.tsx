import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { expirarPlanesVencidos } from "@/lib/expirarPlanes";
import { PlanesForm } from "@/components/PlanesForm";

export default async function PlanesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  await expirarPlanesVencidos();

  const usuario = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { nivelPlan: true, planExpiraEn: true },
  });

  const solicitudPendiente = await prisma.solicitudPlan.findFirst({
    where: { userId: session.user.id, estado: "PENDIENTE" },
  });

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-8">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
          Destacá tus repuestos
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Aparecé primero en búsquedas y en la home para vender más rápido.
        </p>

        <PlanesForm
          nivelActual={usuario?.nivelPlan ?? "NINGUNO"}
          planExpiraEn={usuario?.planExpiraEn?.toISOString() ?? null}
          solicitudPendiente={!!solicitudPendiente}
        />
      </div>
    </main>
  );
}
