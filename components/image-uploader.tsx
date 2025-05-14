"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileImage, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ImageUploaderProps {
  onImageSelected: (imageData: string) => void
}

export function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="w-full">
      <Card
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-64 cursor-pointer transition-colors ${
          isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <FileImage className="w-12 h-12 text-purple-500 mb-4" />
        <p className="text-center text-gray-600 mb-2">Select a tongue image to analyze</p>
        <p className="text-center text-gray-500 text-sm mb-4">Please ensure good lighting and a clear view</p>
        <Button variant="outline" className="flex gap-2">
          <Upload size={16} />
          Select Image
        </Button>
       {/* <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} /> */}
     <input
  type="file"
  ref={fileInputRef}
  className="hidden"
  accept="image/*"
  capture="environment"
  onChange={handleFileChange}
/>

      </Card>
    </div>
  )
}
