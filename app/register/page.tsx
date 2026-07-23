"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo crear la cuenta");
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login");
        return;
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[#F6F6F4] px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-[#E4E4E1] bg-white p-7 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="relative flex h-10 w-14 items-center justify-center rounded-[4px] border-2 border-[#16181D] bg-white text-xs font-bold tracking-tight text-[#16181D]">
            BOL
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#FF5A1F]" />
          </span>
          <h1 className="mt-4 text-xl font-extrabold tracking-tight text-[#16181D]">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Registrate para comprar y vender repuestos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-[#16181D]">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#16181D]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#16181D]">
              Contraseña
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16] disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E4E4E1]" />
          <span className="text-xs text-[#6B7280]">o</span>
          <div className="h-px flex-1 bg-[#E4E4E1]" />
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="mt-4 w-full rounded-full border border-[#E4E4E1] bg-white px-4 py-3 text-sm font-semibold text-[#16181D] transition-colors hover:border-[#16181D]"
        >
          Continuar con Google
        </button>

        <p className="mt-5 text-center text-sm text-[#6B7280]">
          ¿Ya tenés cuenta?{" "}
          <a href="/login" className="font-semibold text-[#FF5A1F] hover:underline">
            Iniciá sesión
          </a>
        </p>
      </div>
    </div>
  );
}
