import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json([], { status: 200 });
  }

  const history = await prisma.history.findMany({
    where: { userEmail: session.user.email },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(history);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { url: base64, prompt, modelName } = await req.json();

  // Ensure directory exists
  const dir = path.join(process.cwd(), "public", "generated");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Strip base64 prefix
  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, "");

  // Create file
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
  const filePath = path.join(dir, fileName);

  await writeFile(filePath, Buffer.from(cleanBase64, "base64"));

  const publicUrl = `/generated/${fileName}`;

  const saved = await prisma.history.create({
    data: {
      url: publicUrl,
      prompt,
      modelName,
      userEmail: session.user.email,
    },
  });

  return Response.json(saved);
}

