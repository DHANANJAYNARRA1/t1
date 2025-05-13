"use client"

import { useRef, useState } from "react"
import { Button } from "./ui/button"

interface Props {
  onImageCaptured: (base64: string) => void
}

export function CameraCapture({ onImageCaptured }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)

  const startCamera = async () => {
    setIsCameraOn(true)
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (videoRef.current) videoRef.current.srcObject = stream
  }

  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)
      const base64 = canvas.toDataURL("image/jpeg")
      onImageCaptured(base64)
    }
    stopCamera()
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraOn(false)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isCameraOn ? (
        <>
          <video ref={videoRef} autoPlay className="rounded max-h-72" />
          <div className="flex gap-4">
            <Button onClick={captureImage}>Capture</Button>
            <Button variant="outline" onClick={stopCamera}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <Button onClick={startCamera}>Start Camera</Button>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}
