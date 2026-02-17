"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

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
    } catch {
      showToast("โหลดข้อมูลไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => load(), 400);
    return () => clearTimeout(timeout);
  }, [query, categoryId]);

  const shareBase = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/l/`;
  }, []);

  async function onDelete(id: string) {
    const ok = window.confirm("ยืนยันการลบลิงก์นี้?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      showToast("ลบสำเร็จ 🗑", "success");
      await load();
    } catch {
      showToast("ลบไม่สำเร็จ ❌", "error");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black flex items-center justify-center p-6"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-xl text-sm font-medium border backdrop-blur-lg
              ${
                toast.type === "error"
                  ? "bg-red-600/90 border-red-400 text-white"
                  : "bg-emerald-600/90 border-emerald-400 text-white"
              }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-6 text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Linktree Dashboard
          </h1>

          <Link
            href="/links/new"
            className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:opacity-80 transition"
          >
            + เพิ่มลิงก์
          </Link>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            placeholder="ค้นหา..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-white/20 border border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="text-black">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cards */}
        <motion.div layout className="grid gap-4">
          <AnimatePresence>
            {links.map((l) => (
              <motion.div
                key={l.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>
                    <h2 className="text-lg font-semibold">
                      {l.title}
                    </h2>

                    {l.description && (
                      <p className="text-sm text-white/70 mt-1">
                        {l.description}
                      </p>
                    )}

                    <div className="text-xs text-white/60 mt-2">
                      หมวดหมู่: {l.category?.name ?? "-"} • คลิก {l.clicks} ครั้ง
                    </div>

                    <div className="text-xs text-white/70 mt-1">
                      แชร์: {shareBase}{l.id}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(`${shareBase}${l.id}`);
                          showToast("คัดลอกแล้ว ✅", "success");
                        } catch {
                          showToast("คัดลอกไม่สำเร็จ ❌", "error");
                        }
                      }}
                      className="px-3 py-2 text-sm rounded-lg bg-black text-white"
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => onDelete(l.id)}
                      className="px-3 py-2 text-sm rounded-lg bg-red-500 text-white"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {loading && (
          <div className="text-center text-sm text-white/60 mt-6">
            กำลังโหลด...
          </div>
        )}
      </div>
    </motion.div>
  );
}
