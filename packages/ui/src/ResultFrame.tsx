'use client'

import React from 'react'

export interface ResultFrameProps {
  inputUrl?: string | null
  outputUrl?: string | null
}

const ResultFrame = ({ inputUrl, outputUrl }: ResultFrameProps) => {
  return (
    <div className="bg-white/60 rounded-2xl p-4 shadow-md border border-pink-50">
      <h3 className="text-lg font-semibold mb-3">Preview</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500 mb-2">Sketch</div>
          <div className="w-64 h-64 bg-gradient-to-b from-pink-50 to-white rounded-lg flex items-center justify-center border overflow-hidden">
            {inputUrl ? <img src={inputUrl} alt="input" className="object-cover w-full h-full" /> : <div className="text-xs text-gray-400">No sketch selected</div>}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500 mb-2">Generated</div>
          <div className="w-64 h-64 bg-gradient-to-b from-purple-50 to-white rounded-lg flex items-center justify-center border overflow-hidden">
            {outputUrl ? <img src={outputUrl} alt="generated" className="object-cover w-full h-full" /> : <div className="text-xs text-gray-400">Result will appear here</div>}
          </div>
        </div>
      </div>

      {outputUrl && (
        <div className="mt-4 flex items-center gap-3">
          <a href={outputUrl} download="fashion_generated.png" className="px-4 py-2 rounded-full bg-white border text-sm shadow-sm">
            Download
          </a>
          <button onClick={() => outputUrl && window.open(outputUrl, '_blank')} className="px-4 py-2 rounded-full bg-pink-50 border text-sm">
            Open
          </button>
        </div>
      )}
    </div>
  )
}

export default ResultFrame

