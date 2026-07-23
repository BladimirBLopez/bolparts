export default function TerminosPage() {
  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
          Términos y condiciones
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Última actualización: julio de 2026
        </p>

        <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-[#16181D]">
          <section>
            <h2 className="font-semibold">1. Qué es BolParts</h2>
            <p className="mt-1 text-[#6B7280]">
              BolParts es una plataforma que conecta a compradores y
              vendedores de repuestos de auto en Bolivia. No vendemos
              repuestos directamente: solo facilitamos que los usuarios
              publiquen anuncios y se contacten entre sí para acordar la
              compraventa por su cuenta.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">2. Responsabilidad de los usuarios</h2>
            <p className="mt-1 text-[#6B7280]">
              Cada usuario es responsable de la veracidad de la información
              que publica, así como de las condiciones de la transacción que
              acuerde con otro usuario. BolParts no interviene en pagos,
              entregas ni garantías de los productos.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">3. Publicaciones</h2>
            <p className="mt-1 text-[#6B7280]">
              Al publicar un repuesto, el usuario declara que tiene derecho a
              venderlo y que las fotos y la descripción corresponden al
              producto real. Nos reservamos el derecho de eliminar
              publicaciones falsas, engañosas o que infrinjan estos términos.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">4. Contenido prohibido</h2>
            <p className="mt-1 text-[#6B7280]">
              No está permitido publicar repuestos robados, falsificados, o
              cualquier contenido ilegal, ofensivo o fraudulento.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">5. Cuentas</h2>
            <p className="mt-1 text-[#6B7280]">
              Sos responsable de mantener la seguridad de tu cuenta. Podemos
              suspender cuentas que incumplan estos términos.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">6. Cambios</h2>
            <p className="mt-1 text-[#6B7280]">
              Podemos actualizar estos términos en cualquier momento. El uso
              continuo de la plataforma implica la aceptación de los cambios.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">7. Contacto</h2>
            <p className="mt-1 text-[#6B7280]">
              Ante cualquier consulta sobre estos términos, podés contactarnos
              a través de la plataforma.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
