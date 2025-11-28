"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import UploadBox from "@repo/ui/UploadBox";
import ResultFrame from "@repo/ui/ResultFrame";
import { useOverlayLoader } from "@repo/store/overlay-loader";
import { useHistoryStore } from "@repo/store/history";
import GenerateDesigner from "@repo/ui/GenerateDesigner";
import OrDivider from "@repo/ui/OrDivider";

export default function GeneratePage() {
  const { data: session } = useSession();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const showOverlay = useOverlayLoader((s) => s.show);
  const hideOverlay = useOverlayLoader((s) => s.hide);

  function onSelectFile(f: File | null) {
    setErr(null);
    setResultUrl(null);
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  async function handleGenerate() {
    setErr(null);

    if (!file) return setErr("Please choose a sketch image first.");
    if (!session?.user?.email) return setErr("You must be signed in.");

    setLoading(true);
    showOverlay();

    try {
      // Upload image to backend model server
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch("http://localhost:5328/generate", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Server error ${res.status}`);
      }

      const data = await res.json();

      let url = data.result_base64;
      if (!url) throw new Error("Missing result_base64 in response");
      if (!url.startsWith("data:")) {
        url = "data:image/png;base64," + url;
      }

      setResultUrl(url);

      // local immediate update
      useHistoryStore.getState().add(url);

      // save to DB (email is auto-detected from session)
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          prompt: "Sketch to design",
          modelName: "StyleGAN-CLIP",
        }),
      });

    } catch (e: any) {
      setErr(e?.message || "Unknown error");
    } finally {
      hideOverlay();
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-25 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900">
              Generate Unique{" "}
              <span className="text-pink-500">Fashion Designs</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Upload a sketch and our GAN will render a styled garment image.
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-md bg-pink-500 text-white shadow-md hover:brightness-95"
            onClick={() => window.scrollTo(0, document.body.scrollHeight)}
          >
            Start Generating
          </button>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <UploadBox
              file={file}
              onSelectFile={onSelectFile}
              disabled={loading}
            />

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={loading || !file}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-medium transition ${
                  loading || !file
                    ? "bg-pink-200 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-purple-400 text-white shadow-lg"
                }`}
              >
                {loading ? "Generating..." : "Generate"}
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                  setResultUrl(null);
                }}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700"
              >
                Reset
              </button>
            </div>

            {err && (
              <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
                {err}
              </div>
            )}
          </div>

          <div>
            <ResultFrame inputUrl={previewUrl} outputUrl={resultUrl} />
          </div>
        </section>
        <OrDivider />
        <GenerateDesigner />
        </div>
    </main>
  );
}

