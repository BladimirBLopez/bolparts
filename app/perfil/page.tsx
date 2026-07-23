import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/ProfileForm";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      image: true,
      phone: true,
      email: true,
      businessBanner: true,
      businessDescription: true,
      businessHours: true,
      businessAddress: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
          Mi perfil
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Actualizá tu información personal.
        </p>

        <ProfileForm
          initialName={user.name || ""}
          initialImage={user.image}
          initialPhone={user.phone}
          email={user.email || ""}
          initialBusinessBanner={user.businessBanner}
          initialBusinessDescription={user.businessDescription}
          initialBusinessHours={user.businessHours}
          initialBusinessAddress={user.businessAddress}
        />
      </div>
    </main>
  );
}
