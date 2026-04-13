"use client";
// components/admin/AdminDeletePost.tsx
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  id: string;
  title: string;
  resource?: "blog" | "products";
}

export function AdminDeletePost({ id, title, resource = "blog" }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/${resource}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success(`"${title}" deleted`);
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          Delete
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
