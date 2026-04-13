// app/api/contact/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: body.read },
    });
    return NextResponse.json(message);
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorised") {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
