import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import prisma from "@repo/db/client";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  req: NextRequest,
  // Use a permissive type here so TS won't reject different shapes provided by Next's types
  context: any
) {
  const rawId = context?.params?.id;

  // normalize id into a single string/number
  const idStr = Array.isArray(rawId) ? rawId[0] : rawId;
  const historyId = Number(idStr);

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (isNaN(historyId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const entry = await prisma.history.findUnique({
    where: { id: historyId },
  });

  if (!entry || entry.userEmail !== session.user.email) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (entry.url?.startsWith("/generated/")) {
    const filePath = path.join(process.cwd(), "public", entry.url);
    try {
      await unlink(filePath);
    } catch {
      // ignore if file doesn't exist / can't be deleted
    }
  }

  await prisma.history.delete({
    where: { id: historyId },
  });

  return NextResponse.json({ success: true });
}

