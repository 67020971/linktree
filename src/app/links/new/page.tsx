"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewLinkPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function isValidUrl(value: string) {
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const t = title.trim();
    const u = url.trim();

    if (!t || !u) return setError("กรุณากรอก ชื่อลิงก์ และ URL");
    if (!isValidUrl(u)) return setError("URL ต้องขึ้นต้นด้วย http:// หรือ https://");

    setSubmitting(true);
    try {
      // ถ้า API ของคุณใช้ categoryId ให้เปลี่ยน payload ตามนั้น
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: t,
          url: u,
          description: description.trim() || null,
          category: category.trim() || null,
        }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "เพิ่มลิงก์ไม่สำเร็จ");
      }

      router.push("/links");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden px-4 py-10">
      {/* Background (subtle, like modal on dark page) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl opacity-25 bg-indigo-500" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full blur-3xl opacity-20 bg-purple-500" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
      </div>

      {/* Modal-like card */}
      <div className="relative z-10 mx-auto w-full max-w-[520px]">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)] overflow-hidden">
          {/* subtle inner gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-indigo-500/[0.06]" />

          <div className="relative p-7 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-white">เพิ่มลิงก์ใหม่</h1>
              </div>

              <Link
                href="/links"
                aria-label="ปิด"
                className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/80">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <Field label="ชื่อลิงก์ *">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น Portfolio ของฉัน"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition
                             focus:border-white/20 focus:bg-white/10"
                  required
                />
              </Field>

              <Field label="URL *">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition
                             focus:border-white/20 focus:bg-white/10"
                  required
                />
              </Field>

              <Field label="คำอธิบาย">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="รายละเอียดเพิ่มเติม..."
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition resize-none
                             focus:border-white/20 focus:bg-white/10"
                />
              </Field>

              <Field label="หมวดหมู่">
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="เช่น Social, Work, Personal"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition
                             focus:border-white/20 focus:bg-white/10"
                />
              </Field>

              {/* Actions */}
              <div className="pt-2 flex gap-4">
                <Link
                  href="/links"
                  className="flex-1 text-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white/80
                             hover:bg-white/10 transition"
                >
                  ยกเลิก
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white transition
                             bg-gradient-to-r from-indigo-500 to-purple-500
                             hover:from-indigo-400 hover:to-purple-400
                             disabled:opacity-60 disabled:cursor-not-allowed
                             shadow-[0_12px_40px_rgba(99,102,241,0.25)]"
                >
                  {submitting ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </form>
          </div>

          {/* bottom fade like screenshot */}
          <div className="h-6 bg-gradient-to-b from-transparent to-black/10" />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">{label}</label>
      {children}
    </div>
  );
}