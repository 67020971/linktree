"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Category = { id: string; name: string };
type LinkItem = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  clicks: number;
  category?: Category | null;
};

export default function LinksPage() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      if (query) qs.set("query", query);
      if (categoryId) qs.set("categoryId", categoryId);

      const [linksRes, catRes] = await Promise.all([
        fetch(`/api/links?${qs.toString()}`).then((r) => r.json()),
        fetch(`/api/categories`).then((r) => r.json()),
      ]);

      setLinks(linksRes);
      setCategories(catRes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      load();
    }, 400);
    return () => clearTimeout(timeout);
  }, [query, categoryId]);

  const shareBase = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/l/`;
  }, []);

  async function onDelete(id: string) {
    if (!confirm("ยืนยันการลบลิงก์นี้?")) return;
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-600 flex items-center justify-center p-6">
       <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-6 text-white">


        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Linktree 
          </h1>

          <Link
            href="/links/new"
            className="px-4 py-2 rounded-xl bg-black text-WHILE font-semibold hover:opacity-80 transition"
          >
            + เพิ่มลิงก์
          </Link>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            placeholder="ค้นหา: ชื่อ / URL / คำอธิบาย"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 text-gray-500">
            กำลังโหลดข้อมูล...
          </div>
        )}

        {/* Card List */}
        <div className="grid gap-4">
          {links.map((l) => (
            <div
              key={l.id}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition border"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <h2 className="text-lg font-semibold">{l.title}</h2>
                  {l.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {l.description}
                    </p>
                  )}

                  <div className="text-xs text-gray-400 mt-2">
                    หมวดหมู่: {l.category?.name ?? "-"} • คลิก {l.clicks} ครั้ง
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    ปลายทาง: {l.url}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    แชร์: {shareBase}
                    {l.id}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${shareBase}${l.id}`);
                      alert("คัดลอกแล้ว!");
                    }}
                    className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-100 transition"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => onDelete(l.id)}
                    className="px-3 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!loading && links.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              ไม่พบลิงก์
            </div>
          )}
        </div>
      </div>
    </div>
  );
}