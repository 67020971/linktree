"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LinkType = {
  id: string;
  title: string;
  url: string;
  description?: string;
};

export default function LinksPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLink = async (id: string) => {
    const confirmDelete = confirm("ลบลิงก์นี้ใช่ไหม?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black p-6 text-white">
      {/* Glow Background Effect */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.25),transparent_50%)]" />

      <div className="max-w-4xl mx-auto">
        {/* Header + Back Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            📌 All Links
          </h1>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition text-sm"
          >
            ← กลับหน้าหลัก
          </Link>
        </div>

        {links.length === 0 && (
          <p className="text-white/60">ยังไม่มีลิงก์</p>
        )}

        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  {link.title}
                </h2>

                {link.description && (
                  <p className="text-white/60 text-sm mt-1">
                    {link.description}
                  </p>
                )}

                <a
                  href={link.url}
                  target="_blank"
                  className="text-indigo-400 text-sm underline mt-2 block hover:text-indigo-300 transition"
                >
                  {link.url}
                </a>
              </div>

              <button
                onClick={() => deleteLink(link.id)}
                className="bg-red-600/80 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-medium transition"
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
