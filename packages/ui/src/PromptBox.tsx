"use client";

import { useState } from "react";

interface PromptBoxProps {
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PromptBox({ onChange, disabled }: PromptBoxProps) {
  const [prompt, setPrompt] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setPrompt(value);
    onChange(value);
  }

  return (
    <div className="mt-4">
      <label className="text-sm font-semibold text-gray-700 mb-2 block">
        Prompt
      </label>
      <textarea
        disabled={disabled}
        value={prompt}
        onChange={handleChange}
        placeholder="Describe the fashion design you want..."
        className="w-full border rounded-xl p-4 text-sm shadow-sm focus:ring-pink-400 focus:outline-none"
        rows={4}
      />
    </div>
  );
}

