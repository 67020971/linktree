"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewLinkPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          url,
          description,
          categoryId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "บันทึกไม่สำเร็จ");
        return;
      }

      router.push("/links");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black flex items-center justify-center p-6">
    
    <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-8 text-white">

      <h1 className="text-3xl font-bold mb-6 text-center">
        เพิ่มลิงก์ใหม่
      </h1>

      <form onSubmit={onSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="ชื่อ"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
          required
        />

        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
          required
        />

        <textarea
          placeholder="คำอธิบาย"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-80 transition disabled:opacity-50"
        >
          {loading ? "กำลังบันทึก..." : "บันทึก"}
        </button>

      </form>
    </div>
  </div>
);

}
