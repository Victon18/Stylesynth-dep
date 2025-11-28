"use client";

import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function DeleteButton({
  id,
  onDelete,
}: {
  id: number;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 px-3 py-1 text-sm bg-pink-600 hover:bg-pink-700 transition rounded text-white"
      >
        Delete
      </button>

      <ConfirmModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          onDelete();
        }}
      />
    </>
  );
}

