"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  _count: { links: number };
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    setLoading(true);

    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    setLoading(false);
    load();
  }

  async function onDelete(id: string) {
    if (!confirm("ยืนยันการลบหมวดหมู่นี้?")) return;

    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    load();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          จัดการหมวดหมู่
        </h1>

        {/* Add Form */}
        <form
          onSubmit={onCreate}
          className="flex gap-3 mb-6"
        >
          <input
            type="text"
            placeholder="ชื่อหมวดหมู่"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-xl"
          >
            {loading ? "กำลังเพิ่ม..." : "เพิ่ม"}
          </button>
        </form>

        {/* List */}
        <div className="space-y-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-gray-500">
                  มี {c._count.links} ลิงก์
                </div>
              </div>

              <button
                onClick={() => onDelete(c.id)}
                className="text-red-500 hover:text-red-600"
              >
                ลบ
              </button>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="text-gray-400 text-center py-6">
              ยังไม่มีหมวดหมู่
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
