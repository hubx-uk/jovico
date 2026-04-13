"use client";
// components/admin/AdminTogglePost.tsx
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props { id: string; published: boolean }

export function AdminTogglePost({ id, published }: Props) {
  const [isPending, startTransition] = useTransition();
  const [localPub, setLocalPub] = useState(published);
  const router = useRouter();

  async function toggle() {
    const next = !localPub;
    setLocalPub(next);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(next ? "Post published" : "Post unpublished");
      startTransition(() => router.refresh());
    } catch {
      setLocalPub(!next);
      toast.error("Failed to update");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={`jv-badge text-xs font-semibold cursor-pointer transition-colors ${
        localPub
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      }`}
    >
      {localPub ? "● Published" : "○ Draft"}
    </button>
  );
}
