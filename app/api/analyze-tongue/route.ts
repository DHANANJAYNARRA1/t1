// Update the generateMockAnalysis function to include detectedColors
function generateMockAnalysis() {
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
