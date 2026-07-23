"use client";

import { useEffect, useState } from "react";

type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isPremium: boolean;
  createdAt: string;
  _count: { listings: number };
};

type AdminListing = {
  id: string;
  title: string;
  price: number;
  user: { id: string; name: string | null; email: string };
  reports: { id: string; reason: string; details: string | null }[];
  images: { url: string }[];
};

export default function AdminPage() {
  const [tab, setTab] = useState<"users" | "listings">("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [usersRes, listingsRes] = await Promise.all([
      fetch("/api/admin/users"),
      fetch("/api/admin/listings"),
    ]);
    const usersData = await usersRes.json();
    const listingsData = await listingsRes.json();
    if (usersData.ok) setUsers(usersData.users);
    if (listingsData.ok) setListings(listingsData.listings);
    setLoading(false);
  }

  async function changeRole(id: string, role: string) {
    const res = await fetch("/api/admin/users/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!data.ok) {
      alert(data.error || "No se pudo cambiar el rol");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  async function togglePremium(id: string, isPremium: boolean) {
    const res = await fetch("/api/admin/users/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPremium }),
    });
    const data = await res.json();
    if (!data.ok) {
      alert(data.error || "No se pudo cambiar el estado premium");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isPremium } : u))
    );
  }

  async function deleteListing(id: string) {
    if (!confirm("¿Borrar esta publicación?")) return;
    const res = await fetch("/api/listings/" + id, { method: "DELETE" });
    const data = await res.json();
    if (!data.ok) {
      alert(data.error || "No se pudo borrar");
      return;
    }
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#F6F6F4] pb-16">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <h1 className="text-2xl font-extrabold text-[#16181D] mb-6">
          Panel Admin
        </h1>

        <div className="flex gap-2 mb-6 border-b border-[#E4E4E1]">
          <button
            onClick={() => setTab("users")}
            className={
              "px-4 py-2 font-bold text-sm " +
              (tab === "users"
                ? "text-[#FF5A1F] border-b-2 border-[#FF5A1F]"
                : "text-[#6B7280]")
            }
          >
            Usuarios ({users.length})
          </button>
          <button
            onClick={() => setTab("listings")}
            className={
              "px-4 py-2 font-bold text-sm " +
              (tab === "listings"
                ? "text-[#FF5A1F] border-b-2 border-[#FF5A1F]"
                : "text-[#6B7280]")
            }
          >
            Publicaciones ({listings.length})
          </button>
        </div>

        {loading && <p className="text-[#6B7280]">Cargando...</p>}

        {!loading && tab === "users" && (
          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-white border border-[#E4E4E1] rounded-xl p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-bold text-[#16181D] truncate">
                    {u.name || "Sin nombre"}
                    {u.isPremium && (
                      <span className="ml-1.5 text-[#FF5A1F]">★ Premium</span>
                    )}
                  </p>
                  <p className="text-sm text-[#6B7280] truncate">{u.email}</p>
                  <p className="text-xs text-[#6B7280]">
                    {u._count.listings} publicaciones
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="border border-[#E4E4E1] rounded-lg px-2 py-1 text-sm font-bold"
                  >
                    <option value="USER">USER</option>
                    <option value="SELLER">SELLER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button
                    onClick={() => togglePremium(u.id, !u.isPremium)}
                    className={
                      "text-xs font-bold px-2 py-1 rounded-lg border " +
                      (u.isPremium
                        ? "border-[#FF5A1F] text-[#FF5A1F]"
                        : "border-[#E4E4E1] text-[#6B7280]")
                    }
                  >
                    {u.isPremium ? "Quitar premium" : "Hacer premium"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === "listings" && (
          <div className="space-y-2">
            {listings.map((l) => (
              <div
                key={l.id}
                className="bg-white border border-[#E4E4E1] rounded-xl p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-[#16181D] truncate">
                      {l.title}
                    </p>
                    <p className="text-sm text-[#6B7280] truncate">
                      {l.user.name || l.user.email} · Bs {l.price}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteListing(l.id)}
                    className="text-sm font-bold text-red-600 shrink-0"
                  >
                    Borrar
                  </button>
                </div>
                {l.reports.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#E4E4E1]">
                    <p className="text-xs font-bold text-[#FF5A1F]">
                      {l.reports.length} reporte(s)
                    </p>
                    {l.reports.map((r) => (
                      <p key={r.id} className="text-xs text-[#6B7280]">
                        {r.reason}
                        {r.details ? ": " + r.details : ""}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {listings.length === 0 && (
              <p className="text-[#6B7280]">No hay publicaciones.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
