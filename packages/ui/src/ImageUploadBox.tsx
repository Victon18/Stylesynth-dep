"use client";

import { useState } from "react";

interface ImageUploadBoxProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export default function ImageUploadBox({ onFileSelect, disabled }: ImageUploadBoxProps) {
  const [preview, setPreview] = useState<string | null>(null);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <div className="mt-6">
      <label className="text-sm font-semibold text-gray-700 mb-2 block">
        Upload Image (Optional)
      </label>

      <label
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-pink-500"}`}
      >
        <span className="text-gray-500 text-sm">Click to upload or drag an image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleSelect}
          disabled={disabled}
          className="hidden"
        />
      </label>

      {preview && (
        <img
          src={preview}
          className="mt-4 rounded-xl shadow-lg border"
          alt="preview"
        />
      )}
    </div>
  );
}

