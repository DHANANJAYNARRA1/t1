"use client"

import { AlertTriangle, CheckCircle, FileText, Info, ClipboardList, Stethoscope, Share2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { TongueAnalysisResult } from "./tongue-analyzer"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { useRef } from "react"

interface AnalysisResultsProps {
  results: TongueAnalysisResult
}

const tongueColorChart = [
  {
    color: "Healthy Pink with Thin White Coating",
    aliases: ["healthy pink", "normal tongue", "thin white coating", "pink"],
    meaning: "Normal hydration, balanced diet, and good overall health.",
  },
  {
    color: 'Bright Red ("Strawberry Tongue")',
    aliases: ["bright red", "red tongue", "strawberry tongue", "red"],
    meaning: "Could indicate Vitamin B12 deficiency, Kawasaki disease, or Scarlet fever.",
  },
  {
    color: "Pale Tongue",
    aliases: ["pale", "light pink", "anemic tongue", "pale pink"],
    meaning: "May be related to anemia, low iron levels, or poor blood circulation.",
  },
  {
    color: "Blue or Purple Tongue",
    aliases: ["blue", "purple", "cyanotic"],
    meaning: "Often linked with heart or lung issues or poor oxygen delivery.",
  },
  {
    color: "White Coating",
    aliases: ["white", "white coating", "oral thrush"],
    meaning: "Can indicate oral thrush (Candida), dehydration, or leukoplakia.",
  },
  {
    color: "Yellow Coating",
    aliases: ["yellow", "yellow coating", "bacterial coating"],
    meaning: "May result from bacterial overgrowth or poor oral hygiene.",
  },
  {
    color: "Black (Black Hairy Tongue)",
    aliases: ["black", "black hairy tongue"],
    meaning: "Often caused by smoking, poor hygiene, or antibiotic use.",
  },
  {
    color: "Geographic Tongue (red patches with white borders)",
    aliases: ["geographic", "patchy tongue"],
    meaning: "Non-serious, possibly triggered by stress or irritation.",
  },
  {
    color: "Fissured Tongue (grooves or cracks)",
    aliases: ["fissured", "cracked tongue", "grooved tongue"],
    meaning: "May occur naturally or due to dehydration or aging.",
  },
  {
    color: "Smooth, Glossy Tongue",
    aliases: ["smooth", "glossy", "bald tongue"],
    meaning: "Can suggest deficiencies in iron, folate, or B12.",
  },
  {
    color: "Grayish or Brown Tongue",
    aliases: ["gray", "brown", "discolored tongue"],
    meaning: "Usually related to smoking, certain medications, or poor hygiene.",
  },
]

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const pdfRef = useRef<HTMLDivElement>(null)

  // Extract color information from the appearance or description
  const extractColors = () => {
    const colors = []

    // Add the main color from appearance if available
    if (results.appearance?.color) {
      colors.push(results.appearance.color.toLowerCase())
    }

    // Add coating information if available
    if (results.appearance?.coating) {
      colors.push(results.appearance.coating.toLowerCase())
    }

    // If we have explicit detected colors, use those
    if (results.detectedColors && Array.isArray(results.detectedColors)) {
      return results.detectedColors
    }

    return colors
  }

  // Find relevant chart entries based on extracted colors
  const relevantChart = tongueColorChart.filter((item) => {
    const extractedColors = extractColors()
    return item.aliases.some((alias) => extractedColors.some((color) => color.includes(alias.toLowerCase())))
  })

  const downloadPDF = async () => {
    const input = pdfRef.current
    if (!input) return

    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const width = pdf.internal.pageSize.getWidth()
    const height = (canvas.height * width) / canvas.width
    pdf.addImage(imgData, "PNG", 0, 0, width, height)
    pdf.save("tongue-analysis-results.pdf")
  }

  return (
    <div className="space-y-6" ref={pdfRef}>
      {/* Description */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-purple-600" />
            AI-Generated Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{results.description}</p>
        </CardContent>
      </Card>

      {/* Deficiencies & Health Concerns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deficiencies */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-purple-600" />
              Nutritional Deficiencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.potentialDeficiencies && results.potentialDeficiencies.length > 0 ? (
              <ul className="space-y-2">
                {results.potentialDeficiencies.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No specific deficiencies detected.</p>
            )}
          </CardContent>
        </Card>

        {/* Health Concerns */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-purple-600" />
              Potential Health Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.potentialConcerns && results.potentialConcerns.length > 0 ? (
              <ul className="space-y-2">
                {results.potentialConcerns.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No specific health concerns detected.</p>
            )}
            <Separator className="my-4" />
           
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.recommendations && results.recommendations.length > 0 ? (
            <ul className="space-y-2">
              {results.recommendations.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-800">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No specific recommendations available.</p>
          )}
        </CardContent>
      </Card>

      {/* Relevant Tongue Color Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-purple-600" />
            Medically Matched Tongue Chart from Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {relevantChart.length > 0 ? (
            relevantChart.map((item, index) => (
              <div key={index} className="border rounded-lg p-3 bg-purple-50">
                <p className="font-semibold text-purple-800">{item.color}</p>
                <p className="text-gray-700 text-sm">{item.meaning}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No relevant tongue indicators matched.</p>
          )}
        </CardContent>
      </Card>

      {/* PDF Button */}
      <div className="flex justify-end">
        <Button onClick={downloadPDF} className="mt-4 gap-2">
          <Share2 className="h-4 w-4" />
          Share Results as PDF
        </Button>
      </div>
    </div>
  )
}
