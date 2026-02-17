"use client";

import { useEffect, useState } from "react";

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

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    // ✅ ลบออกจาก state ทันที
    setLinks((prev) => prev.filter((link) => link.id !== id));
  } catch (error) {
    console.error("Delete error:", error);
    alert("ลบไม่สำเร็จ");
  }
};

  useEffect(() => {
    fetchLinks();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">📌 All Links</h1>

      {links.length === 0 && (
        <p className="text-gray-500">ยังไม่มีลิงก์</p>
      )}

      <div className="space-y-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold text-lg">{link.title}</h2>
              {link.description && (
                <p className="text-gray-500 text-sm">
                  {link.description}
                </p>
              )}
              <a
                href={link.url}
                target="_blank"
                className="text-blue-600 text-sm underline"
              >
                {link.url}
              </a>
            </div>

            <button
              onClick={() => deleteLink(link.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
            >
              ลบ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
