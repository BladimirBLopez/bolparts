export default function PrivacidadPage() {
  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
          Política de privacidad
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Última actualización: julio de 2026
        </p>

        <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-[#16181D]">
          <section>
            <h2 className="font-semibold">1. Qué datos recolectamos</h2>
            <p className="mt-1 text-[#6B7280]">
              Recolectamos tu nombre, correo electrónico, y, si elegís
              iniciar sesión con Google, tu foto de perfil. Cuando publicás
              un repuesto, también guardamos el número de WhatsApp que
              proporcionás para que los compradores te contacten.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">2. Para qué usamos tus datos</h2>
            <p className="mt-1 text-[#6B7280]">
              Usamos tu información para crear y gestionar tu cuenta, mostrar
              tus publicaciones y perfil público, y permitir que otros
              usuarios te contacten por WhatsApp cuando publicás un repuesto.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">3. Qué información es pública</h2>
            <p className="mt-1 text-[#6B7280]">
              Tu nombre, foto de perfil, las publicaciones que hacés y las
              reseñas que recibís son visibles públicamente en tu perfil de
              vendedor. El número de WhatsApp que cargás en cada publicación
              también es visible para quien vea esa publicación.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">4. Con quién compartimos datos</h2>
            <p className="mt-1 text-[#6B7280]">
              No vendemos ni compartimos tus datos personales con terceros
              con fines publicitarios. Usamos servicios externos como
              Cloudinary para almacenar las fotos de tus publicaciones y
              Google para el inicio de sesión.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">5. Tus derechos</h2>
            <p className="mt-1 text-[#6B7280]">
              Podés borrar tus publicaciones en cualquier momento desde "Mis
              publicaciones". Si querés eliminar tu cuenta o tus datos
              personales, podés contactarnos a través de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">6. Cambios</h2>
            <p className="mt-1 text-[#6B7280]">
              Podemos actualizar esta política en cualquier momento. Te
              recomendamos revisarla periódicamente.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
