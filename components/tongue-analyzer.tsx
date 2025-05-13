"use client"

import { useState } from "react"
import { Camera, Upload, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { CameraCapture } from "@/components/camera-capture"
import { AnalysisResults } from "@/components/analysis-results"
import { TongueReference } from "@/components/tongue-reference"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AnalysisMode = "upload" | "camera"
type AnalysisStatus = "idle" | "analyzing" | "complete" | "error"

export interface TongueAnalysisResult {
  description: string
  appearance: {
    color: string
    coating: string
    texture: string
    moisture: string
  }
  potentialDeficiencies: string[]
  potentialConcerns: string[]
  recommendations: string[]
  detectedColors?: string[] // Make this optional
}

export function TongueAnalyzer() {
  const [mode, setMode] = useState<AnalysisMode>("upload")
  const [status, setStatus] = useState<AnalysisStatus>("idle")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [results, setResults] = useState<TongueAnalysisResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDemo, setIsDemo] = useState(false)

  const handleImageSelected = async (imageData: string) => {
    setImageUrl(imageData)
    setStatus("idle")
    setResults(null)
    setErrorMessage(null)
    setIsDemo(false)
  }

  const handleReset = () => {
    setImageUrl(null)
    setStatus("idle")
    setResults(null)
    setErrorMessage(null)
    setIsDemo(false)
  }

  const handleAnalyze = async () => {
    if (!imageUrl) return

    setStatus("analyzing")
    setErrorMessage(null)
    setIsDemo(false)

    try {
      const { result, isDemo: demoResult } = await analyzeTongueImage(imageUrl)
      setResults(result)
      setIsDemo(demoResult)
      setStatus("complete")
    } catch (error) {
      console.error("Analysis failed:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Tabs defaultValue="analyzer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyzer">Analyzer</TabsTrigger>
          <TabsTrigger value="reference">Reference Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              {!imageUrl ? (
                <div className="space-y-6">
                  <div className="flex justify-center gap-4">
                    <Button
                      variant={mode === "upload" ? "default" : "outline"}
                      onClick={() => setMode("upload")}
                      className="flex gap-2"
                    >
                      <Upload size={18} />
                      Upload Image
                    </Button>
                    <Button
                      variant={mode === "camera" ? "default" : "outline"}
                      onClick={() => setMode("camera")}
                      className="flex gap-2"
                    >
                      <Camera size={18} />
                      Use Camera
                    </Button>
                  </div>

                  {mode === "upload" ? (
                    <ImageUploader onImageSelected={handleImageSelected} />
                  ) : (
                    <CameraCapture onImageCaptured={handleImageSelected} />
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Tongue image"
                      className="max-h-80 rounded-lg object-contain"
                    />
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={handleReset} className="flex gap-2">
                      <RefreshCw size={18} />
                      Reset
                    </Button>
                    <Button onClick={handleAnalyze} disabled={status === "analyzing"} className="flex gap-2">
                      {status === "analyzing" ? "Analyzing..." : "Analyze"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {status === "error" && errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {isDemo && status === "complete" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                You are viewing simulated analysis results for demonstration purposes.
              </AlertDescription>
            </Alert>
          )}

          {results && status === "complete" && <AnalysisResults results={results} />}
        </TabsContent>

        <TabsContent value="reference">
          <TongueReference />
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function analyzeTongueImage(imageBase64: string): Promise<{ result: TongueAnalysisResult; isDemo: boolean }> {
  try {
    // Try to use the real API first
    try {
      const API_KEY = "AIzaSyDBmEc_ARuy5JD_NooPEf9Lz_CX380UTdw"
      const endpoint =
        "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + API_KEY

      const base64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64,
                  },
                },
                {
                  text: `Analyze this tongue image and provide a detailed assessment.
                  
                  Return ONLY a valid JSON object with the following structure:
                  {
                    "description": "Detailed description of the tongue",
                    "appearance": {
                      "color": "Main color of the tongue",
                      "coating": "Description of any coating",
                      "texture": "Texture description",
                      "moisture": "Moisture level"
                    },
                    "potentialDeficiencies": ["List of potential deficiencies"],
                    "potentialConcerns": ["List of potential health concerns"],
                    "recommendations": ["List of recommendations"]
                  }
                  
                  Do not include any text before or after the JSON object. The response must be valid JSON.`,
                },
              ],
            },
          ],
        }),
      })

      const data = await response.json()
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!rawText) {
        throw new Error("Empty response from API")
      }

      // Try to extract JSON from the response
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const jsonData = JSON.parse(jsonMatch[0])
          return { result: jsonData, isDemo: false }
        } catch (jsonError) {
          console.error("Error parsing extracted JSON:", jsonError)
          throw new Error("Failed to parse JSON from API response")
        }
      } else {
        throw new Error("No JSON found in API response")
      }
    } catch (apiError) {
      console.error("API error, falling back to mock data:", apiError)
      // Fall back to mock data
      return { result: generateMockAnalysis(), isDemo: true }
    }
  } catch (error) {
    console.error("Error analyzing image:", error)
    throw error
  }
}

// Function to generate realistic mock analysis data
function generateMockAnalysis(): TongueAnalysisResult {
  // Create an array of possible mock analyses to randomly select from
  const mockAnalyses = [
    {
      description:
        "The tongue appears to be of normal pink color with a thin white coating. The surface is relatively smooth with normal papillae distribution. The tongue appears adequately moist, indicating normal hydration levels.",
      appearance: {
        color: "Pink",
        coating: "Thin white coating",
        texture: "Normal",
        moisture: "Adequate",
      },
      potentialDeficiencies: ["Possible mild vitamin B deficiency", "Potential mild iron deficiency"],
      potentialConcerns: ["Mild dehydration possible", "No major health concerns identified from this image"],
      recommendations: [
        "Increase water intake throughout the day",
        "Consider a balanced diet rich in B vitamins and iron",
        "Maintain good oral hygiene",
        "Regular dental check-ups",
      ],
      detectedColors: ["pink", "thin white coating"],
    },
    {
      description:
        "The tongue has a slightly pale pink color with a moderate white coating, particularly in the middle and back portions. The texture appears normal with some minor indentations along the sides. The moisture level seems adequate.",
      appearance: {
        color: "Pale pink",
        coating: "Moderate white coating",
        texture: "Minor indentations on sides",
        moisture: "Adequate",
      },
      potentialDeficiencies: [
        "Iron deficiency possible",
        "Vitamin B12 deficiency possible",
        "Folate deficiency possible",
      ],
      potentialConcerns: ["Possible anemia", "Digestive system imbalance", "Potential immune system weakness"],
      recommendations: [
        "Increase consumption of iron-rich foods (leafy greens, red meat, beans)",
        "Consider B-complex supplements after consulting with a healthcare provider",
        "Improve digestive health with probiotics and fiber",
        "Stay well-hydrated throughout the day",
      ],
      detectedColors: ["pale pink", "white coating"],
    },
    {
      description:
        "The tongue appears bright pink with minimal coating. The surface shows normal papillae with good texture. The tongue appears well-hydrated with no signs of dryness or cracks.",
      appearance: {
        color: "Bright pink",
        coating: "Minimal",
        texture: "Normal papillae",
        moisture: "Well-hydrated",
      },
      potentialDeficiencies: [],
      potentialConcerns: ["Possible slight inflammation", "No significant health concerns identified"],
      recommendations: [
        "Maintain current hydration levels",
        "Continue balanced diet with plenty of fruits and vegetables",
        "Regular oral hygiene practices",
        "Monitor for any changes in tongue appearance",
      ],
      detectedColors: ["bright pink"],
    },
  ]

  // Return a random analysis from the mock data
  return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)]
}
