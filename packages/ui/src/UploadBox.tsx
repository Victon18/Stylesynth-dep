'use client'

import React from 'react'

export interface UploadBoxProps {
  file: File | null
  onSelectFile: (f: File | null) => void
  disabled?: boolean
}

const UploadBox = ({ file, onSelectFile, disabled }: UploadBoxProps) => {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null
    onSelectFile(f)
  }

  return (
    <div className="border border-pink-100 rounded-xl p-4 bg-white/60 shadow-sm">
      <label className="flex flex-col items-center gap-3 cursor-pointer">
        <div className={`w-full h-48 rounded-lg border-2 border-dashed flex items-center justify-center p-4 transition ${disabled ? 'opacity-60 pointer-events-none' : 'hover:scale-[1.01]'}`}>
          {file ? (
            <div className="flex items-center gap-4 w-full">
              <img src={URL.createObjectURL(file)} alt="preview" className="w-36 h-36 object-cover rounded-md border" />
              <div>
                <div className="font-semibold text-gray-800">{file.name}</div>
                <div className="text-sm text-gray-500 mt-1">{Math.round(file.size / 1024)} KB</div>
                <div className="mt-3 text-xs text-gray-500">Replace file by choosing a new image.</div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl">✏️</div>
              <div className="mt-2 font-medium text-gray-700">Drop or select a sketch image</div>
              <div className="text-xs text-gray-400 mt-1">PNG/JPG recommended. 256x256 — grayscale or RGB.</div>
            </div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={disabled} />
      </label>
    </div>
  )
}

export default UploadBox

