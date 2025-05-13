import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function TongueReference() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-700 text-center">
            Medically Accurate Tongue Color Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

            {/* Each condition block */}
            {referenceData.map((item, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-rose-700 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
                {index !== referenceData.length - 1 && <Separator className="my-3" />}
              </div>
            ))}

          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Tongue color reference data
const referenceData = [
  {
    title: "Healthy Pink with Thin White Coating",
    description: "Normal hydration, good health",
  },
  {
    title: "Bright Red (\"Strawberry Tongue\")",
    description: "Vitamin B12 deficiency, Kawasaki disease, Scarlet fever",
  },
  {
    title: "Pale Tongue",
    description: "Anemia, poor circulation, nutrient deficiencies",
  },
  {
    title: "Blue or Purple Tongue",
    description: "Cyanosis, heart or lung disease, poor oxygenation",
  },
  {
    title: "White Coating",
    description: "Oral thrush (Candida), dehydration, leukoplakia",
  },
  {
    title: "Yellow Coating",
    description: "Bacterial overgrowth, poor oral hygiene, dry mouth",
  },
  {
    title: "Black (Black Hairy Tongue)",
    description: "Excess keratin, smoking, poor oral hygiene, antibiotics",
  },
  {
    title: "Geographic Tongue (red patches with white borders)",
    description: "Unknown cause, possibly related to stress or irritation",
  },
  {
    title: "Fissured Tongue (grooves or cracks)",
    description: "Often normal, may be associated with dehydration or aging",
  },
  {
    title: "Smooth, Glossy Tongue",
    description: "Nutritional deficiencies (e.g., iron, folate, B12)",
  },
  {
    title: "Grayish or Brown Tongue",
    description: "Smoking, poor hygiene, certain medications",
  },
]
