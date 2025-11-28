import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import GalleryList from "@repo/ui/GalleryList";

export default async function GallaryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Generated Designs</h1>
        <p className="text-neutral-500">You are not signed in.</p>
      </div>
    );
  }

  const history = await prisma.history.findMany({
    where: { userEmail: session.user.email },
    orderBy: { createdAt: "desc" },
  });

  return <GalleryList initialHistory={history} />;
}

