// app/admin/blog/[id]/page.tsx  (also used for /new via [...id] routing trick)
// For "new" we create a separate page at /admin/blog/new/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostEditor } from "@/components/admin/BlogPostEditor";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-8">Edit Post</h1>
      <BlogPostEditor post={post} mode="edit" />
    </div>
  );
}
