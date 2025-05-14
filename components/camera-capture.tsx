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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use rear camera on mobile
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsCameraOn(true)
        }
      }
    } catch (err) {
      console.error("Camera access error:", err)
      alert("Unable to access camera. Please allow permission.")
    }
  }

  const captureImage = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    // Ensure the video is ready
    if (video.readyState < 2) {
      alert("Camera not ready yet. Please try again.")
      return
    }

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
    const video = videoRef.current
    if (video && video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      video.srcObject = null
    }
    setIsCameraOn(false)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isCameraOn ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded max-h-72 w-full object-contain"
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
