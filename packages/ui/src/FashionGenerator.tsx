"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@repo/ui/ui/card"
import { Button } from "@repo/ui/ui/button"
import { Download, Wand2, ChevronLeft, ChevronRight, X } from "lucide-react"

const DATA_URL =
  "https://raw.githubusercontent.com/zalandoresearch/feidegger/refs/heads/master/data/FEIDEGGER_release_1.2.json"

interface SampleItem {
  id: string
  image: string
  descriptions: string[]
  split: string
}

const ITEMS_PER_PAGE = 15

const FashionGenerator = () => {
  const [samples, setSamples] = useState<SampleItem[]>([])
  const [page, setPage] = useState(1)

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tuneSample, setTuneSample] = useState<SampleItem | null>(null)

  const [convertedDescription, setConvertedDescription] = useState("")
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  // Load dataset
  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(DATA_URL)
      const json = await res.json()

      const parsed = json.map((item: any, index: number) => ({
        id: `sample-${index}`,
        image: item.url,
        descriptions: item.descriptions || [],
        split: item.split,
      }))

      setSamples(parsed)
    }
    loadData()
  }, [])

  // Pagination
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const paginated = samples.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const totalPages = Math.ceil(samples.length / ITEMS_PER_PAGE)

  const downloadImage = (url: string) => {
    const a = document.createElement("a")
    a.href = url
    a.download = url.split("/").pop() || "sample.jpg"
    a.click()
  }

  // Handle Tune Click (Convert description to English)
  const handleTune = async (sample: SampleItem) => {
    setTuneSample(sample)
    setDrawerOpen(true)
    setConvertedDescription("")
    setPrompt("")
    setLoading(true)

    try {
      const germanText = sample.descriptions.join("\n")

      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: germanText }),
      })

      const json = await res.json()
      setConvertedDescription(json.output || "Failed to translate.")
    } catch (e) {
      setConvertedDescription("Error converting description.")
    }

    setLoading(false)
  }

  return (
    <div className="space-y-8">

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Prev
        </Button>

        <div className="text-sm opacity-70">
          Page {page} / {totalPages}
        </div>

        <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.map(item => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all">
            <CardContent className="p-0">

              <div className="w-full h-64 bg-muted rounded-md overflow-hidden">
                <img
                  src={item.image}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setPreviewImage(item.image)}
                />
              </div>

              <div className="p-4">
                <div className="flex gap-2">
                  <Button className="w-full" onClick={() => handleTune(item)}>
                    <Wand2 className="w-4 h-4 mr-2" /> Tune
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => downloadImage(item.image)}>
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fullscreen Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-8">
          <div className="relative max-w-3xl max-h-[85vh]">
            <img src={previewImage} className="rounded-xl max-h-[80vh] object-contain" />

            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-4 right-0 bg-white/90 px-3 py-1 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* RIGHT SIDE CUSTOM DRAWER */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl z-[9998]
          transform transition-transform duration-300
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tune Sample</h2>

          <button onClick={() => setDrawerOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 overflow-y-auto h-full space-y-6">

          {/* Image */}
          {tuneSample && (
            <div className="border rounded-lg overflow-hidden">
              <img src={tuneSample.image} className="object-contain w-full max-h-72" />
            </div>
          )}

          {/* Descriptions FIRST */}
          {tuneSample && (
            <div>
              <h3 className="font-semibold mb-2">Descriptions:</h3>
              <ul className="list-disc ml-5 space-y-1 text-gray-700">
                {tuneSample.descriptions.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Converted English Description */}
          <div>
            <h3 className="font-semibold mb-2">Converted (English):</h3>

            <div className="border rounded-lg bg-gray-100 p-3 min-h-[100px]">
              {loading ? "Converting..." : convertedDescription}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <h3 className="font-semibold mb-2">Prompt</h3>
            <textarea
              className="w-full border p-3 rounded-lg h-32"
              placeholder="Write your prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

            <Button className="w-full" onClick={() => {}}>
              <Wand2 className="w-4 h-4 mr-2" />
              Apply Tune
            </Button>
        </div>
      </div>
    </div>
  )
}

export default FashionGenerator

