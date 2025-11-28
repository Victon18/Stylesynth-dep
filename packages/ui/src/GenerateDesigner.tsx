"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import PromptBox from "@repo/ui/PromptBox";
import ImageUploadBox from "@repo/ui/ImageUploadBox";

export default function GenerateDesigner() {
  const { data: session } = useSession();

  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleGenerate() {
    setErr(null);

    if (!session?.user?.email) return setErr("Please sign in first.");
    if (!prompt && !file) return setErr("Enter a prompt or upload an image.");

    setLoading(true);

    try {
      let url = "";

      // ✅ IMAGE → IMAGE
      if (file) {
        const fd = new FormData();
        fd.append("prompt", prompt || "fashion design");
        fd.append("image", file);

        const res = await fetch("/api/image-to-image", {
          method: "POST",
          body: fd,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Generation failed");

        url = data.image;
        if (!url.startsWith("data:")) {
          url = `data:${data.mime};base64,${url}`;
        }
      }

      // ✅ TEXT → IMAGE
      else {
        const res = await fetch("/api/text-to-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        let data: any;
        try {
          data = await res.json();
        } catch {
          const text = await res.text();
          throw new Error(
            `Non-JSON response from API: ${text.slice(0, 200)}`
          );
        }

        if (!res.ok) throw new Error(data?.error || "Generation failed");

        url = data.image;
        if (!url.startsWith("data:")) {
          url = `data:${data.mime};base64,${url}`;
        }

        // ✅ AUTO-SAVE
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            prompt,
            modelName: "sd3.5-flash",
          }),
        });
      }

      setResultUrl(url);

    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto w-full">

      <PromptBox onChange={setPrompt} disabled={loading} />

      {/*<ImageUploadBox onSelectFile={setFile} disabled={loading} />*/}

      <button
        onClick={handleGenerate}
        disabled={loading || (!prompt && !file)}
        className={`mt-6 w-full py-3 rounded-xl font-medium text-white transition ${
          loading || (!prompt && !file)
            ? "bg-pink-300 cursor-not-allowed"
            : "bg-gradient-to-r from-pink-500 to-purple-400 shadow-lg hover:opacity-90"
        }`}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {err && (
        <p className="mt-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
          {err}
        </p>
      )}

      {resultUrl && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Generated Result</h2>
          <img
            src={resultUrl}
            className="rounded-xl shadow-xl border"
            alt="Generated"
          />
        </div>
      )}
    </div>
  );
}

