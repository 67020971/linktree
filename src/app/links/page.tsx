"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LinkType = {
  id: string;
  title: string;
  url: string;
  description?: string;
};

type ToastType = {
  message: string;
  type: "success" | "error";
};

export default function LinksPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      showToast("โหลดข้อมูลไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("คัดลอกลิงก์แล้ว ✅", "success");
    } catch {
      showToast("คัดลอกไม่สำเร็จ", "error");
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setLinks((prev) => prev.filter((link) => link.id !== id));
      showToast("ลบลิงก์สำเร็จ 🗑", "success");
    } catch {
      showToast("ลบไม่สำเร็จ", "error");
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
      
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 animate-slideIn
          ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
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

              <div className="flex gap-3">
                <button
                  onClick={() => copyLink(link.url)}
                  className="bg-indigo-500/80 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm transition"
                >
                  Copy
                </button>

                <button
                  onClick={() => deleteLink(link.id)}
                  className="bg-red-600/80 hover:bg-red-600 px-4 py-2 rounded-xl text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
