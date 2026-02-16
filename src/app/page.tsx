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

  async function load() {
    const qs = new URLSearchParams();
    if (query) qs.set("query", query);
    if (categoryId) qs.set("categoryId", categoryId);

    const [linksRes, catRes] = await Promise.all([
      fetch(`/api/links?${qs.toString()}`).then((r) => r.json()),
      fetch(`/api/categories`).then((r) => r.json()),
    ]);

    setLinks(linksRes);
    setCategories(catRes);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoryId]);

  const shareBase = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/l/`;
  }, []);

  async function onDelete(id: string) {
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div style={headerRowStyle}>
        <h1 style={{ margin: 0 }}>Linktree</h1>

        <Link href="/links/new" style={addBtnStyle}>
          + เพิ่มลิ้ง
        </Link>
      </div>

      <div style={{ display: "flex", gap: 12, margin: "12px 0" }}>
        <input
          placeholder="ค้นหา: ชื่อ / URL / คำอธิบาย"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <table width="100%" cellPadding={10} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th>ชื่อ</th>
            <th>หมวด</th>
            <th>คลิก</th>
            <th>ลิงก์</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {links.map((l) => (
            <tr key={l.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>
                <div>
                  <b>{l.title}</b>
                </div>
                <div style={{ color: "#555" }}>{l.description}</div>
              </td>
              <td>{l.category?.name ?? "-"}</td>
              <td>{l.clicks}</td>
              <td style={{ maxWidth: 340 }}>
                <div style={{ fontSize: 12, color: "#666" }}>ปลายทาง: {l.url}</div>
                <div style={{ fontSize: 12 }}>
                  แชร์: {shareBase}
                  {l.id}
                </div>
              </td>
              <td>
                <button onClick={() => navigator.clipboard.writeText(`${shareBase}${l.id}`)}>
                  Copy
                </button>{" "}
                {/* ปุ่ม Edit ให้ทำเป็น modal/form แล้วเรียก PUT */}
                <button onClick={() => onDelete(l.id)} style={{ color: "crimson" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {links.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 20, color: "#666" }}>
                ไม่พบลิงก์
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const headerRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const addBtnStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 12px",
  borderRadius: 10,
  background: "#111",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 600,
};