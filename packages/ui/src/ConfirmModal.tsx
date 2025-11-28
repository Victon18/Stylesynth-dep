"use client";

export default function ConfirmModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-red-900/40 backdrop-blur-sm animate-fadeIn"
        onClick={onCancel}
      />

      <div className="relative bg-[#4e010d] text-white border-gray-200 rounded-xl p-6 w-full max-w-sm shadow-xl animate-scaleIn border border-neutral-700">
        <h2 className="text-xl font-semibold mb-3">Delete item?</h2>
        <p className="text-white mb-6">
          This action cannot be undone. Are you sure?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-[#ffc4c5] hover:bg-[#ffdfe0] transition text-black"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-[#ff294a] hover:bg-[#d20323] transition text-white"
          >
            Delete
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

