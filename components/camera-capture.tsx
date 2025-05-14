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
    try {
      const constraints = {
        video: {
          facingMode: { ideal: "environment" } // Use back camera on mobile
        },
        audio: false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsCameraOn(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access the camera. Please allow camera permission.")
    }
  }

  const captureImage = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Set canvas size same as video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current frame from video
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const base64 = canvas.toDataURL("image/jpeg")
    onImageCaptured(base64)
    stopCamera()
  }

  const stopCamera = () => {
    const video = videoRef.current
    if (video && video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      video.srcObject = null
    }
    setIsCameraOn(false)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {isCameraOn ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded w-full h-auto max-h-96 border"
          />
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
