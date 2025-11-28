"use client";

import Image from "next/image";
import DeleteButton from "./DeleteButton";
import { useState } from "react";
import clsx from "clsx";

export default function GalleryList({ initialHistory }: { initialHistory: any[] }) {
  const [history, setHistory] = useState(initialHistory);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    setDeletingId(id);

    // Wait for animation before removal
    setTimeout(async () => {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });

      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete item");
        setDeletingId(null);
      }
    }, 300); // match CSS animation
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Generated Designs</h1>

      {history.length === 0 && (
        <div className="text-neutral-500">No history available.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
        {history.map((item) => (
          <div
            key={item.id}
            className={clsx(
              "rounded-lg border border-neutral-800 p-4 bg-[#f0daec] transition-all duration-300",
              deletingId === item.id
                ? "opacity-0 scale-95 blur-sm"
                : "opacity-100 scale-100"
            )}
          >
            <div className="relative w-full h-64 mb-4">
              <Image
                src={item.url}
                alt="Generated image"
                fill
                className="object-cover rounded-md"
                unoptimized
              />
            </div>

            <p className="text-xs text-black">
              {new Date(item.createdAt).toLocaleString()}
            </p>

            <DeleteButton id={item.id} onDelete={() => handleDelete(item.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

